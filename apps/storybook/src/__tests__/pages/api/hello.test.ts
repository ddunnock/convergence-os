import { describe, it, expect, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../../pages/api/hello";

describe("API /api/hello", () => {
  it("returns 200 status code", () => {
    const req = {} as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns greeting with name John Doe", () => {
    const req = {} as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({ name: "John Doe" });
  });
});
