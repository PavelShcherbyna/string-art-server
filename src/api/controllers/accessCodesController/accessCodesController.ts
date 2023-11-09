import { RequestHandler } from 'express';
import XLSX from 'xlsx';
import AccessKeys, { IAccessKey } from '../../../models/AccessKeys';
import { decrypt, encrypt } from '../../../helpers/crypto';

interface ICodeObject {
  code: string;
  url: string;
}

// SETTINGS:
const codeLength = 6; // Codes will be 6 digits length

const baseURL = process.env.FRONTEND_BASE_URL || '';
const fileName = 'access_keys';
const filePath = `./temp/${fileName}.xlsx`;
// Column width and rows height for xlsx file:
const wsCols = [{ wch: 6 }, { wch: baseURL.length + codeLength * 2 }];
const wsRows = [{ hpx: 16 }];

// HELPERS:
function codeGeneration(codesArr: string[], quantity: number): string[] {
  const arrayOfCodes = [...codesArr];
  const initLength = arrayOfCodes.length;

  for (let i = arrayOfCodes.length; arrayOfCodes.length < initLength + quantity; i++) {
    const timeStamp = new Date().getTime();
    const randomLong = Math.floor(timeStamp * Math.random());

    const sixDigitCode = randomLong.toString().slice(0, codeLength);

    if (!arrayOfCodes.includes(sixDigitCode) && sixDigitCode.length === codeLength) {
      // arrayOfCodes.push({ code: sixDigitCode, url: `${baseURL}?code=${sixDigitCode}` });
      arrayOfCodes.push(sixDigitCode);
    }
  }

  return arrayOfCodes;
}

function prepareCodesForFile(codesArr: string[]): ICodeObject[] {
  function codePreparing(code: string): ICodeObject {
    return { code: code, url: `${baseURL}?code=${code}` };
  }

  return codesArr.map(codePreparing);
}

function writeXLSXFile(data: ICodeObject[], path: string): void {
  const workSheet = XLSX.utils.json_to_sheet(data);
  workSheet['!cols'] = wsCols;
  workSheet['!rows'] = wsRows;
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
  XLSX.writeFile(workBook, path);
}

// Extracting old codes, generating new codes, and adding them to the old ones
export const createCodes: RequestHandler = async (req, res, next) => {
  try {
    const query = req.query;
    const quantity = Number(query.q) || 1;

    // Getting old codes from DB:
    const oldEncodedCodes: IAccessKey[] = await AccessKeys.find();
    const oldDecodedCodes = oldEncodedCodes.map((el) => decrypt(el));

    // Generating new codes and adding them to the old ones:
    const arrayOfCodes = [...codeGeneration(oldDecodedCodes, quantity)];

    const newCodes = arrayOfCodes.filter((el) => !oldDecodedCodes.includes(el));

    const encodedNewCodes: IAccessKey[] = await Promise.all(
      newCodes.map(async (code) => await encrypt(code))
    );

    // Saving new codes into DB:
    await AccessKeys.create(encodedNewCodes);

    // Preparing xlsx file and send it as response:
    const dataForFile = prepareCodesForFile(newCodes);

    writeXLSXFile(dataForFile, filePath);

    return res.download(filePath);
  } catch (err) {
    next(err);
  }
};

export const getAllCodes: RequestHandler = async (req, res, next) => {
  try {
    const allEncodedCodes: IAccessKey[] = await AccessKeys.find();
    const allDecodedCodes = allEncodedCodes.map((el) => decrypt(el));

    const dataForFile = prepareCodesForFile(allDecodedCodes);

    writeXLSXFile(dataForFile, filePath);

    return res.download(filePath);
  } catch (err) {
    next(err);
  }
};
