import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { config } from './config';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET;

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  public get client() {
    return this.minio.client;
  }

  //function to upload the file / image in the minio server
  async upload(file: BufferedFile, baseBucket: string = config.MINIO_BUCKET) {
    if (
      !(
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('JPG') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('heic')
      )
    ) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
    // const temp_filename = Date.now().toString();
    const temp_filename = file.buffer;
    //creating new hashed file name for the image with md5 encryption
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');

    //getting the extension of the file
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };

    //creating new file name by combining hash name and extension
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;

    //uploading the file to the minio service
    this.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      metaData,
      function (err, res) {
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );

    //returning the url of the image to be stored in the database as string
    return {
      url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
    };
  }

  //function to delete the particular image from the minio server using its name
  async delete(objetName: string) {
    this.client.removeObject(this.baseBucket, objetName, function (err, res) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happened',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
