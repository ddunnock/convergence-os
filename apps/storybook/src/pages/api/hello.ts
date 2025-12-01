// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

/** Response data structure for the hello endpoint */
type Data = {
  name: string;
};

/**
 * API route handler for the hello endpoint. Returns a simple greeting response.
 *
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
