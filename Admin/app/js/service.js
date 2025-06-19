class ProductService {
    getListProduct() {
        const promise = axios({
            url: "https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang",
            method: "GET",
        });
        return promise;
    }

    deleteProductAPI(id) {
        const promise = axios({
            url: `https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang/${id}`,
            method: "DELETE",
        });
        return promise;
    }

    editProductAPI(id, product) {
        const promise = axios({
            url: `https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang/${id}`,
            method: "PUT",
            data: product,
        });
        return promise;
    }

    addProductAPI(product) {
        const promise = axios({
            url: "https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang",
            method: "POST",
            data: product,
        });
        return promise;
    }

    getProductByIdAPI(id) {
        const promise = axios({
            url: `https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang/${id}`,
            method: "GET",
        });
        return promise;
    }
}
export default ProductService