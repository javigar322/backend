import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  createPost(@Body() post: CreatePostDto) {
    return this.postService.createPost(post);
  }
  @Get()
  getPost() {
    return this.postService.getPosts();
  }
}
