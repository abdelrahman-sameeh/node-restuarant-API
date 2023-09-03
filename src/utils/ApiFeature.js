class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    let queryStringObj = { ...this.queryString };
    const excludeFields = ["limit", "sort", "page", "fields", "keyword"];
    Object.keys(queryStringObj).map((key) => {
      if (excludeFields.includes(key)) {
        delete queryStringObj[key];
      }
    });
    let queryStringFilter = JSON.stringify(queryStringObj);
    queryStringFilter = JSON.parse(
      queryStringFilter.replace(/\b(gte|gt|lte|lt)\b/gi, (match) => `$${match}`)
    );
    this.mongooseQuery = this.mongooseQuery.find(queryStringFilter);

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replace(/,/g, " ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sort = this.queryString.sort;
      sort = sort.replace(/,/g, " ");
      this.mongooseQuery = this.mongooseQuery.sort(sort);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("+createdAt");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { details: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocuments) {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (countDocuments > endIndex) {
      pagination.nextPage = +page + 1;
    }

    pagination.previousPage = skip > 0 ? pagination.currentPage - 1 : 0;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResults = pagination;

    return this;
  }
}

module.exports = ApiFeature;
