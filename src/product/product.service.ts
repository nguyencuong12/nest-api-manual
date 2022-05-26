import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import * as bcrypt from 'bcrypt';
import { ProductDto } from './dto/create-product.dto';

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
    return { product: data, count: productAmount };
    // return await this.productModel.find().exec();
  }
  async createProduct(product: Product) {
    try {
      const newProduct = new this.productModel(product);
      console.log('NEW PRODUCT', newProduct);
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
  async fetchVitamin(page: number) {
    // let productAmount = await this.productModel.countDocuments();
    const query = this.productModel.find({
      type: 'vitamin',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ type: 'vitamin' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };
  }
  async fetchProduct(id: string) {
    try {
      return await this.productModel.findById(id);
      // MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
    } catch (err) {
      throw err;
    }
  }
  async fetchFoodProducts(page: number) {
    const query = this.productModel.find({
      hashtag: '#food',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ hashtag: '#food' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };

    // return await this.productModel.find({ hashtag: '#food' }).exec();
  }
  async fetchFeatureProduct() {
    return await this.productModel.find({ hashtag: '#feature' }).exec();
  }
  async fetchCatBreeds(page: number) {
    const query = this.productModel.find({
      type: 'breed',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ type: 'breed' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };

    // return await this.productModel.find({ type: 'breed' }).exec();
  }
  async fetchCatSeeds(page: number) {
    const query = this.productModel.find({
      type: 'seed',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ type: 'seed' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };
  }
  async fetchCatPate(page: number) {
    const query = this.productModel.find({
      type: 'pate',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ type: 'pate' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };
  }
  async fetchToys(page: number) {
    const query = this.productModel.find({
      type: 'toys',
      skip: 10,
      limit: 3,
    });
    let productAmount = await this.productModel.find({ type: 'toys' });
    // const pageSelect: number = page || 1;
    const limit: number = 4;
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { product: data, count: productAmount.length };
  }
  async deleteProduct(id: string) {
    try {
      return await this.productModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw new err();
    }
  }
  async updateProduct(product: ProductDto) {
    const filter = { _id: product._id };
    try {
      return await this.productModel.findOneAndUpdate(filter, product, {
        new: true,
      });
    } catch (err) {
      throw new err();
    }
  }
}
