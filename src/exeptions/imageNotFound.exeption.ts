import { HttpException, HttpStatus } from "@nestjs/common";

class PostNotFoundExeption extends HttpException {
    constructor(imageId: number) {
        super(`Image with id ${imageId} not found`, HttpStatus.NOT_FOUND);
    }
}