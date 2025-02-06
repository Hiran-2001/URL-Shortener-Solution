import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Url } from 'src/url/entities/url.entity';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb+srv://hiranrajofficial:Hiran2001@cluster0.hoc1s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
            database: 'URL-Shortener',
            entities: [Url, Auth],
            synchronize: true
        })
    ],
})
export class DatabaseModule { }
