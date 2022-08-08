import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
// import { ProductDto } from './dto/create-product.dto';
import { ProductUpdateDto } from './dto/update-product.dto';
import { ProductCreateDto } from './dto/create-product.dto';
import { productImages } from './interfaces/productInterface';
import * as path from 'path';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async fetchAllProduct(currentPage: number) {
    // MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
    let productAmount = await this.productModel.countDocuments();
    const query = this.productModel.find({ skip: 10, limit: 3 });
    const page: number = currentPage || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    // console.log('data', data);
    return { _productList: data, count: productAmount };
    // return await this.productModel.find().exec();
  }
  async createProduct(product: ProductCreateDto) {
    try {
      console.log('CREATE PRODUCT CALL ', product);
      const newProduct = new this.productModel(product);
      return newProduct.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Product Name Exist !!!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  async fetchTotalAmountProduct() {
    return await this.productModel.find({});
  }
  async fetchHotProduct() {
    return await this.productModel.find({ hashtag: '#hot' }).exec();
  }
  async fetchBestSaleProducts() {
    return await this.productModel.find({ hashtag: '#bestsale' }).exec();
  }

  async fetchProduct(id: string) {
    try {
      return await this.productModel.findById(id);
      // MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
    } catch (err) {
      throw err;
    }
  }
  async fetchFeatureProduct() {
    return await this.productModel.find({ hashtag: '#feature' }).exec();
  }
 
  async deleteImagesProduct(idProduct: string, idImage: string) {
    let product: ProductUpdateDto = await this.productModel.findById(idProduct);
    product.image.map((image: any, index) => {
      if (idImage == image.id) {
        product.image.splice(index, 1);
      }
    });

    await this.productModel.findOneAndUpdate({ _id: product._id }, product);
    return product;
  }
 
  async deleteProduct(id: string) {
    try {
      return await this.productModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw new err();
    }
  }
  async fetchProductsFromType(type: string) {
    let products = await this.productModel.find({ type: type });
    return products;
  }
  async getProductsFromCategory(category:string[]){
    // let products = await this.productModel.find({categories:category});
    let products = await this.productModel.find({type:
     category
      // category
    });
    console.log("products",products);
    return products;
  }
  async getProductsFromHashTag(hashtag:string){
    let products = await this.productModel.find({ hashtag: hashtag }).exec();
    return products;
  }
  async getProductsAnhKiet(){
 
    let products = await this.productModel.find(
      
      { type: 'gas-anhkiet' }
      
      
      );
    return products;
  }
  async updateProduct(product: ProductUpdateDto, imageUpdate: any) {
    const filter = { _id: product._id };
    try {
      let arr:any = [];
      let recent = await this.productModel.findById(filter._id);
      product.image.map((instanceUpdate)=>{
        let productIM:productImages = JSON.parse(instanceUpdate.toString())
        arr.push(productIM);
      });
      const resultsDeleteUpdateImage = recent.image.filter(({ id: id1 }) => !arr.some(({ id: id2 }) => id2 === id1));
    
      if(resultsDeleteUpdateImage.length > 0){
        resultsDeleteUpdateImage.map((instance)=>{
          let pathP = path.join(__dirname,"../../uploads/");
          console.log("PATH",pathP);
          let p = pathP +instance.id+".webp";
          console.log("P",p);
          fs.unlink(p, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
         
        })
      }
      product.image = arr;
      product.colors = recent.colors;
      console.log("PRODUCT IMAGE ",product);
      return await this.productModel.findOneAndUpdate(filter, product);
    } catch (err) {
      throw new err();
    }
  }
}
