import { pagination } from './pagination.js'

export class Apifeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery
    this.queryData = queryData
  }
  // pagination
  paginationFun() {
    const { page, size } = this.queryData
    const { limit, skip } = pagination({ page, size })
    this.mongooseQuery.limit(limit).skip(skip)
    return this
  }
  // sort
  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
    return this
  }
  // select
  select() {
    this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '))
    return this
  }

  //filter
  filter() {
    const { page, size, sort, select, search, ...filter } = this.queryData

    const queryFilter = JSON.parse(
      JSON.stringify(filter).replace(
        /gt|gte|lt|lte|in|nin|regex/g,
        (match) => `$${match}`,
      ),
    )
    // console.log(this.mongooseQuery)
    this.mongooseQuery.find(queryFilter)
    return this
  }
}
