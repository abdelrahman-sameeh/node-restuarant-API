const { default: mongoose } = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  image: String

}, {timestamps: true})


categorySchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/src/uploads/Category/${doc.image}`;
    doc.image = image;
  }
});

categorySchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/src/uploads/Category/${doc.image}`;
    doc.image = image;
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;