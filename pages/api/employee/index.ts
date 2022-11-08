// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Handle post method for adding employee
    if (req.method === "POST") {
      try {
        const { id, username, fullName = "", salary } = req.body;

        const postData = {
          id,
          username,
          fullName,
          salary: salary ? salary : 0.0,
        };

        const newEmployee = await prisma.employee
          .create({
            data: postData,
          })
          .catch((err) => {
            // Return error if database error is occur
            return res.status(406).json({
              message: err?.meta?.cause ? err?.meta?.cause : "Not Acceptable",
            });
          });
        res.status(201).json(newEmployee);
      } catch (err) {
        // Return bad request if try is failed
        res.status(400).json({ message: "Bad Request!!" });
      }
      // Handle get method for return employee list
    } else if (req.method === "GET") {
      // Setting up default and passing params
      let {
        page,
        limit = 5,
        sortField = "id",
        sort = "descend",
        minSalary = 0,
        maxSalary,
      } = req.query;
      sort = sort === "descend" ? "desc" : "asc";

      const offset: number = page && +page > 1 ? (+page - 1) * +limit : 0;

      const whereQ = maxSalary
        ? {
            AND: [
              { salary: { lte: parseInt(maxSalary.toString()) } },
              { salary: { gte: parseInt(minSalary.toString()) } },
            ],
          }
        : { AND: [{ salary: { gte: parseInt(minSalary.toString()) } }] };

      const totalRow = await prisma.employee.count({
        where: whereQ,
      });

      if (!totalRow) {
        // return empty obj for no data
        res.status(200).json({ data: [], page: { currentPage: 0, total: 0 } });
      } else {
        const totalPage = totalRow
          ? totalRow / +limit < 1
            ? 1
            : Math.ceil(totalRow / +limit)
          : 1;

        // Run database query
        const result = await prisma.employee
          .findMany({
            skip: offset,
            take: +limit,
            where: whereQ,
            orderBy: {
              [typeof sortField == "string" ? sortField : sortField.toString()]:
                sort,
            },
          })
          .catch((err) => {
            // return error if database error occur
            res.status(205).json(err);
          });
        // Sending success result
        res.status(200).json({
          data: result,
          page: {
            currentPage: +page && +page > 0 ? +page : 1,
            total: totalPage,
            count: totalRow,
          },
        });
      }
    } else {
      // Return method not allow if no method is match
      res.status(405).json({ message: "Method not allowed!!" });
    }
  } catch (err) {
    console.log(err);
    // Return error if try is failing
    res.status(403).json({ err: "Error occurred." });
  }
};
