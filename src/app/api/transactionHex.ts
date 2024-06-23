import { getTransactionHex, getUtxos } from "@/utils/libs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { txId, verbose, blockHash } = req.body;
  try {
    const response = await getTransactionHex(txId, verbose, blockHash);
    res.status(200).json({ status: 200, data: response, message: null });
  } catch (error) {
    res.status(500).json({ status: 200, data: null, message: error });
  }
}
