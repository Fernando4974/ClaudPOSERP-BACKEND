import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload') // Organiza el endpoint en una sección aparte
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @ApiOperation({ summary: 'Subir una imagen a Cloudinary' })
  @ApiConsumes('multipart/form-data') // 👈 Crucial para habilitar la subida en Swagger
  @ApiBody({
    description: 'Archivo de imagen (png, jpeg, jpg, webp) - Máx 4MB',
    schema: {
      type: 'object',
      properties: {
        file: {
          // Este nombre debe coincidir con el FileInterceptor('file')
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida con éxito' })
  @ApiResponse({
    status: 400,
    description: 'Archivo muy grande o formato no permitido',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadFile(file);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    };
  }
}
