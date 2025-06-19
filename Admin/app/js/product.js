class Product {
    constructor(_id, _name, _price, _screen, _blackCamera, _frontCamera, _img, _desc, _type) {
        // Khởi tạo các thuộc tính của sản phẩm
        this.id = _id; // Giả sử id được cung cấp từ bên ngoài
        this.name = _name;
        this.price = _price;
        this.screen = _screen;
        this.blackCamera = _blackCamera;
        this.frontCamera = _frontCamera;
        this.img = _img;
        this.desc = _desc;
        this.type = _type;
        
  }
}
export default Product;