// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const reqMethod = req.method;
    const { id } = req.query;

    if (!id) return res.status(400).json("Bad Request!");

    // Let's do the get method
    if (reqMethod === "GET") {
      const employee = await prisma.employee.findUnique({
        where: {
          id: id.toString(),
        },
      });

      if (!employee) return res.status(205).json({ message: "Not Found!!" });
      res.status(200).json({ data: employee });
      // Let's do the update method
    } else if (reqMethod === "PUT") {
      const { username, fullName = "", salary } = req.body;
      const updateData = {
        username,
        fullName,
        salary: salary ? salary : 0.0,
      };
      const response = await prisma.employee
        .update({
          where: {
            id: id.toString(),
          },
          data: updateData,
        })
        .catch((err) => {
          return res.status(406).json({
            message: err?.meta?.cause ? err?.meta?.cause : "Not Acceptable",
          });
        });
      if (response) {
        res.status(204).json({});
      }

      // Let's write the delete method
    } else if (reqMethod === "DELETE") {
      await prisma.employee
        .delete({
          where: {
            id: id.toString(),
          },
        })
        .catch((err) => {
          return res.status(406).json({
            message: err?.meta?.cause ? err?.meta?.cause : "Not Acceptable",
          });
        });

      res.status(204).json({});
    } else {
      // If not method match return 405
      res.status(405).json({ message: "Method not allowed!!" });
    }
  } catch (err) {
    console.log(err);
    // Return permission denied
    res.status(403).json({ err: "Error occurred." });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
