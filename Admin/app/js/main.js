import ProductService from "./service.js";
import Product from "./product.js";

// Initialize
const productService = new ProductService();
let allProducts = [];
let editingProductId = null;

const getEls = (id) => document.getElementById(id);

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    getListProduct();

    // Add Product Button
    getEls("btnThemSP").onclick = () => {
        resetForm();
        document.querySelector(".modal-title").innerHTML = "Thêm sản phẩm";
        getEls("btnAdd").style.display = "block";
        getEls("btnUpdate").style.display = "none";
        editingProductId = null;
    };

    // Add Product Action
    getEls("btnAdd").onclick = onAddProduct;

    // Update Product Action
    getEls("btnUpdate").onclick = onUpdateProduct;

    // Search functionality
    getEls("txtTimKiem").addEventListener("input", onSearch);
});

// Get List Products
const getListProduct = () => {
    const promise = productService.getListProduct();
    promise
        .then((result) => {
            allProducts = result.data;
            renderProduct(allProducts);
            updateStats();
        })
        .catch((error) => {
            console.log("Error fetching product list:", error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách sản phẩm.', 'error');
        });
};

// Render Products
const renderProduct = (data) => {
    let contentHTML = "";
    if (data.length === 0) {
        contentHTML = `
                    <tr>
                        <td colspan="9" class="text-center py-4">
                            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <p class="text-muted">Không có sản phẩm nào</p>
                        </td>
                    </tr>
                `;
    } else {
        for (let i = 0; i < data.length; i++) {
            const pr = data[i];
            const typeClass = getTypeClass(pr.type);
            contentHTML += `
                        <tr>
                            <td><strong>${i + 1}</strong></td>         
                            <td><strong>${pr.name}</strong></td>
                            <td class="price-cell">${formatPrice(pr.price)}</td>
                            <td>${pr.screen}</td>
                            <td>${pr.frontCamera}</td>
                            <td>${pr.backCamera}</td>
                            <td>
                                <img src="${pr.img}" class="product-img" alt="${pr.name}>"
                            </td>
                            <td>${truncateText(pr.desc, 50)}</td>
                            <td><span class="type-badge ${typeClass}">${pr.type.toUpperCase()}</span></td>
                            <td>
                                <button class="btn btn-info btn-action" onclick="editProduct('${pr.id}')" 
                                        data-bs-toggle="modal" data-bs-target="#productModal">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>        
                                <button class="btn btn-danger btn-action" onclick="deleteProduct('${pr.id}', '${pr.name.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    `;
        }
    }
    getEls("tblDanhSachSP").innerHTML = contentHTML;
};

// Get Form Values
const getValue = () => {
    const NameSP = getEls("NameSP").value.trim();
    const PriceSP = parseFloat(getEls("PriceSP").value);
    const Screen = getEls("Screen").value.trim();
    const BackCamera = getEls("BackCamera").value.trim();
    const FrontCamera = getEls("FrontCamera").value.trim();
    const ImageSP = getEls("ImageSP").value.trim();
    const Desc = getEls("Desc").value.trim();
    const Type = getEls("Type").value;

    const newProduct = new Product(
        editingProductId || "",
        NameSP,
        PriceSP,
        Screen,
        BackCamera,
        FrontCamera,
        ImageSP,
        Desc,
        Type
    );
    return newProduct;
};

// Validate Form
const validateForm = () => {
    const requiredFields = ['NameSP', 'PriceSP', 'Screen', 'BackCamera', 'FrontCamera', 'ImageSP', 'Desc', 'Type'];

    for (const id of requiredFields) {
        const el = getEls(id);
        const label = el.previousElementSibling?.textContent?.trim() || 'trường này';

        if (!el.value.trim()) {
            el.focus();
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: `Vui lòng nhập ${label}`,
            });
            return false;
        }
    }

    const price = parseFloat(getEls("PriceSP").value);
    if (isNaN(price) || price <= 0) {
        getEls("PriceSP").focus();
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Giá sản phẩm phải là số dương',
        });
        return false;
    }

    return true;
};


// Add Product
const onAddProduct = () => {
    if (!validateForm()) return;

    const newProduct = getValue();
    const loadingSwal = Swal.fire({
        title: 'Đang thêm sản phẩm...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    productService.addProductAPI(newProduct)
        .then(() => {
            loadingSwal.close();
            Swal.fire('Thành công!', 'Sản phẩm đã được thêm.', 'success');
            getListProduct();
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        })
        .catch((error) => {
            loadingSwal.close();
            console.error("Error adding product:", error);
            Swal.fire('Lỗi!', 'Thêm sản phẩm không thành công.', 'error');
        });
};

// Edit Product
const editProduct = (id) => {
    editingProductId = id;
    document.querySelector(".modal-title").innerHTML = "Cập nhật sản phẩm";
    getEls("btnAdd").style.display = "none";
    getEls("btnUpdate").style.display = "block";

    productService.getProductByIdAPI(id)
        .then((result) => {
            const product = result.data;
            getEls("NameSP").value = product.name;
            getEls("PriceSP").value = product.price;
            getEls("Screen").value = product.screen;
            getEls("BackCamera").value = product.backCamera;
            getEls("FrontCamera").value = product.frontCamera;
            getEls("ImageSP").value = product.img;
            getEls("Desc").value = product.desc;
            getEls("Type").value = product.type;
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
            Swal.fire('Lỗi!', 'Không thể tải thông tin sản phẩm.', 'error');
        });
};

// Update Product
const onUpdateProduct = () => {
    if (!validateForm()) return;

    const updatedProduct = getValue();
    const loadingSwal = Swal.fire({
        title: 'Đang cập nhật sản phẩm...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    productService.editProductAPI(editingProductId, updatedProduct)
        .then(() => {
            loadingSwal.close();
            Swal.fire('Thành công!', 'Sản phẩm đã được cập nhật.', 'success');
            getListProduct();
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        })
        .catch((error) => {
            loadingSwal.close();
            console.error("Error updating product:", error);
            Swal.fire('Lỗi!', 'Cập nhật sản phẩm không thành công.', 'error');
        });
};

// Delete Product
const deleteProduct = (id, name) => {
    Swal.fire({
        title: `Bạn có chắc muốn xóa "${name}"?`,
        text: "Thao tác này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
                title: 'Đang xóa sản phẩm...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            productService.deleteProductAPI(id)
                .then(() => {
                    loadingSwal.close();
                    Swal.fire('Đã xóa!', `Sản phẩm "${name}" đã được xóa.`, 'success');
                    getListProduct();
                })
                .catch((error) => {
                    loadingSwal.close();
                    console.error("Error deleting product:", error);
                    Swal.fire('Lỗi!', 'Xóa sản phẩm không thành công.', 'error');
                });
        }
    });
};

// Search Products
const onSearch = () => {
    const searchValue = getEls("txtTimKiem").value.toLowerCase().trim();

    if (searchValue === "") {
        renderProduct(allProducts);
    } else {
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue) ||
            product.type.toLowerCase().includes(searchValue) ||
            product.desc.toLowerCase().includes(searchValue)
        );
        renderProduct(filteredProducts);
    }
};
// Sort Name
let sortAsc = true;

getEls("btnSapSep").addEventListener("click", () => {
    sortProductsByName();
    getEls("btnSapSep").innerHTML = sortAsc
  ? '🔤 Sắp xếp A → Z'
  : '🔡 Sắp xếp Z → A';
});

const sortProductsByName = () => {
    const sorted = [...allProducts].sort((a, b) => {
        return sortAsc
            ? a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' })
            : b.name.localeCompare(a.name, 'vi', { sensitivity: 'base' });
    });

    sortAsc = !sortAsc; // Đảo chiều
    renderProduct(sorted);
};

// Utility Functions
const resetForm = () => {
    document.getElementById('productForm').reset();
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
        case 'iphone': return 'type-iphone';
        case 'samsung': return 'type-samsung';
        default: return 'type-other';
    }
};
// Hiện tổng total sản phẩm
const updateStats = () => {
    getEls("totalProducts").textContent = allProducts.length;
};

// Make functions global
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
