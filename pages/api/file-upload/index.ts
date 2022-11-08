// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import * as fs from "fs";
import { Form } from "multiparty";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Initiate form
  const form = new Form({
    encoding: "utf-8",
  });

  // Felids need to be present on csv
  const allRequiredColumns = ["id", "username", "fullName", "salary"];

  // Parse the form data
  const formFiles: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });

  // Creating an array for holding our data
  const csvData: any[] = [];
  try {
    // create the readstream and parse data
    await fs
      .createReadStream(formFiles.file[0].path, { encoding: "utf-8" })
      .pipe(
        parse({
          delimiter: [",", ":"],
          escape: "#",
          ltrim: true,
          columns: true,
          cast: true,
          relax_column_count: false,
        })
      )
      .on("error", (error: any) => {
        // return error while parsing failed
        res.status(400).json(error?.code ? error?.code : "Bad Request");
      })
      .on("data", (csvRow: any) => {
        // check column has data
        const hasAllKeys = allRequiredColumns.every((item) =>
          csvRow.hasOwnProperty(item)
        );
        if (hasAllKeys) {
          // valid data need to store
          csvData.push(csvRow);
        } else {
          // otherwise throw error
          res.status(400).json("Missing required column");
        }
      })
      .on("end", async () => {
        // Process data after finish parsing
        if (csvData.length) {
          for (let i = 0; i < csvData.length; i++) {
            // push data to database
            await prisma.employee
              .upsert({
                where: {
                  id: csvData[i].id,
                },
                update: {
                  username: csvData[i].username,
                  fullName: csvData[i].fullName,
                  salary: csvData[i].salary,
                },
                create: {
                  id: csvData[i].id,
                  username: csvData[i].username,
                  fullName: csvData[i].fullName,
                  salary: csvData[i].salary,
                },
              })
              .catch((err) => {
                // return error while database push failed
                res.status(400).json("Bad Request");
              });
          }
        } else {
          // return error while data invalid
          return res.status(400).json("Bad Request");
        }
        // return success code
        res.status(201).json("Success");
      });
  } catch (error) {
    console.log("err---", error);
    // Return error while try failed
    return res.status(403).json({ err: "Error occurred." });
  }
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
