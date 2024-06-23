import * as coordinate from "chromajs-lib";

import { rpcResponse, tokenData, utxo } from "@/types";
import axios from "axios";

const schnorr = require("bip-schnorr");
const convert = schnorr.convert;
import ecc from "@bitcoinerlab/secp256k1";
import * as bip39 from "bip39";
import BIP32Factory from "bip32";
const bip32 = BIP32Factory(ecc);

import { calculateSize } from "./calculateFee";
import { prepareInputs } from "./prepareInputs";
import { rpcPort, rpcUrl } from "@/lib/constants";
import {
  fetchBlockHash,
  fetchTransactionHex,
  fetchUtxos,
  sendTransactionHelper,
} from "@/lib/service/fetcher";
import {
  checkUsedUtxo,
  getSavedUtxo,
  saveUsedUtxo,
} from "./localStorageHelper";

export const convertDataToSha256Hex = (value: any) => {
  return convert.hash(Buffer.from(value, "utf8")).toString("hex");
};

export const stringtoHex = (value: any) => {
  const buffer = Buffer.from(value, "utf8");
  const hexString = buffer.toString("hex");
  return hexString;
};

export async function mintToken(
  data: tokenData,
  mnemonics: string,
  feeRate: number,
) {
  //PREPARING INPUT UTXO
  let utxos: utxo[] = await fetchUtxos(data.address);
  console.log("🚀 ~ utxos:", utxos);
  if (utxos.length == 0) {
    throw { message: "UTXO not found" };
  }
  let utxo = utxos[0];

  if (checkUsedUtxo(utxo.txid)) {
    console.log("mint waiting started");
    const savedUtxoTxid = getSavedUtxo();

    while (utxo.txid === savedUtxoTxid) {
      console.log("iteration started");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 2 seconds
      utxos = await fetchUtxos(data.address);
      if (utxos.length > 0) {
        utxo = utxos[0];
      } else {
        console.log("no utxo found");
      }
    }

    console.log("mint waiting ended");
  }

  console.log("inputs:", utxo);

  /*   const blockHash = await fetchBlockHash(utxo.height);
  const txHex = await fetchTransactionHex(utxo.txid, true, blockHash.result); */
  let blockHash, txHex;

  //mempool UTXO
  if (utxo.confirmations !== 0) {
    blockHash = await fetchBlockHash(utxo.height);
    let hexResponse = await fetchTransactionHex(
      utxo.txid,
      true,
      blockHash.result,
    );
    txHex = hexResponse.result.hex;
  }

  //Confirmed UTXO
  if (utxo.confirmations === 0) {
    let hexResponse = await fetchTransactionHex(utxo.txid, false, null);
    txHex = hexResponse.result;
  }

  // console.log("transaction confirmations: ", utxo.confirmations);
  // console.log("transaction hex: ", txHex);

  //INITIALIZING V10 TRANSACTION2
  const opreturnData = JSON.stringify(data.opReturnValues);

  const payloadHex = convertDataToSha256Hex(opreturnData);

  const psbt = new coordinate.Psbt({
    network: coordinate.networks.testnet,
  });

  psbt.setVersion(10);
  psbt.assettype = data.assetType;
  psbt.headline = stringtoHex(data.headline);
  psbt.ticker = stringtoHex(data.ticker);
  psbt.payload = payloadHex;
  psbt.payloaddata = stringtoHex(opreturnData);

  if (data.assetType === 0) psbt.setPrecisionType(8);

  //ADDING INPUT
  psbt.addInput({
    hash: utxo.txid,
    index: utxo.vout,
    nonWitnessUtxo: Buffer.from(txHex, "hex"),
  });

  //Output addresses
  const seed = bip39.mnemonicToSeedSync(mnemonics);
  const root = bip32.fromSeed(seed, coordinate.networks.testnet);

  const childNode = root.derivePath("m/84'/2222'/0'");

  const node = childNode.derive(0).derive(0);
  const destNode = childNode.derive(0).derive(2);

  const controllerAddress = coordinate.payments.p2wpkh({
    pubkey: node.publicKey,
    network: coordinate.networks.testnet,
  }).address;
  const toAddress = coordinate.payments.p2wpkh({
    pubkey: destNode.publicKey,
    network: coordinate.networks.testnet,
  }).address;

  if (!controllerAddress || !toAddress)
    throw new Error("Controller or change address does not exists.");

  //Adding outputs
  psbt.addOutput({ address: controllerAddress, value: 10 ** 8 });
  psbt.addOutput({ address: toAddress, value: data.supply });

  const vbytes = await calculateSize(psbt, childNode, utxos);

  const requiredAmount = vbytes * feeRate;

  let inputs: utxo[] = [],
    changeAmount = utxo.value - requiredAmount;

  if (utxo.value < requiredAmount) {
    let result = await prepareInputs(data.address, requiredAmount, feeRate);
    inputs = result.inputs;
    changeAmount = result.changeAmount;
  }

  if (inputs.length !== 0) {
    for (let i = 0; i < inputs.length; i++) {
      let hash = await fetchBlockHash(inputs[i].height);
      let hex = await fetchTransactionHex(inputs[i].txid, true, hash.result);

      psbt.addInput({
        hash: inputs[i].txid,
        index: inputs[i].vout,
        nonWitnessUtxo: Buffer.from(hex.result.hex, "hex"),
      });
    }
  }

  // console.log("Change amount:", changeAmount);

  psbt.addOutput({
    address: toAddress,
    value: changeAmount,
  });

  // return psbt.toHex();

  for (let i = 0; i < psbt.inputCount; i++) {
    const signer = childNode.derive(0).derive(utxos[i].derviation_index);
    psbt.signInput(i, signer);
  }

  psbt.finalizeAllInputs();

  console.log(psbt.extractTransaction(true).toHex());

  console.log("Required fee(before preparing inputs): ", requiredAmount);
  console.log("Actual fee: ", psbt.extractTransaction(true).virtualSize());

  console.log("Inputs: ", psbt.txInputs);
  console.log("Input count: ", psbt.inputCount);

  console.log(
    "Size check amount: ",
    (psbt.extractTransaction(true).virtualSize() * 4) / 1000,
  );

  if ((psbt.extractTransaction(true).virtualSize() * 4) / 1000 > 3600) {
    throw new Error("Maximum file size exceeded.");
  }

  try {
    const response: rpcResponse = await sendTransactionHelper(
      psbt.extractTransaction(true).toHex(),
    );
    console.log(response);
    saveUsedUtxo(utxo.txid);

    return response;
  } catch (error) {
    console.log(error);
  }
}
