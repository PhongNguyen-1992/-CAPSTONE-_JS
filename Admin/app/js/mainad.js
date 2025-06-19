import ProductService from "./service.js";
import Product from "./product.js";
const productService = new ProductService();
const getEls = (id) => document.getElementById(id);
getEls("btnThemSP").onclick = () => {
  document.querySelector(".modal-title").innerHTML = "Thêm sản phẩm";
  const btnAdd = `<button class="btn btn-success" onclick="onAddProduct()">Thêm sản phẩm</button>`;
  document.querySelector(".modal-footer").innerHTML = btnAdd;

}
const getListProduct = () => {
  const promise = productService.getListProduct();
  promise
    .then((result) => {
      console.log(result.data);
      renderProduct(result.data);
    })
    .catch((error) => {
      console.log("Error fetching product list:", error);
      
    })
};
// Render data to HTML
const renderProduct = (data) => {  
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const pr = data[i];
    contentHTML += `
      <tr>
        <td>${i + 1}</td>         
        <td>${pr.name}</td>
        <td>${pr.price}</td>
        <td>${pr.screen}</td>
        <td>${pr.frontCamera}</td>
        <td><img src="../../assetAdmin/IMG/${pr.image}" width = 50px> </td>
        <td>${pr.desc}</td>
        <td>${pr.type}</td>
        <td>
          <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="editHR('${pr.id}')">Edit</button>        
          <button class="btn btn-danger" onclick="deleteHR('${pr.id}', '${pr.name.replace(/'/g, "\\'")}')">Delete</button>
        </td>
      </tr>
    `;
  }
  getEls("tblDanhSachSP").innerHTML = contentHTML;
};
// Call function to get data
getListProduct();
const getValue = () => {
//   const id = getEls("idSanPham").value; // Lấy giá trị id từ input
  // Lấy các giá trị từ form
  const NameSP = getEls("NameSP").value;
  const PriceSP = getEls("PriceSP").value;
  const Screen = getEls("Screen").value;
  const FrontCamera = getEls("FortCamera").value;
  const ImageSP = getEls("ImageSP").value;
  const Desc = getEls("Desc").value;
  const Type = getEls("Type").value;  
  // Tạo đối tượng sản phẩm
  const newProduct = new Product("", NameSP, PriceSP, Screen, FrontCamera, ImageSP, Desc, Type);
  return newProduct;
}

// Thêm nhân viên
getEls("btnAdd").onclick = function () {
    console.log("Thêm sản phẩm");
    
  // Tạo đối tượng nhân viên
  const newProduct = getValue();
  // Gọi API thêm nhân viên
  productService.addProductAPI(newProduct)
    .then(() => {
      Swal.fire('Thành công!', 'Sản phẩm đã được thêm.', 'success');
      getListProduct();
      // Đóng modal
      $('#myModal').modal('hide');
    })
    .then(() => {
      Swal.fire('Thành công!', 'Nhân viên đã được thêm.', 'success');
      getListHR();
      // Đóng modal
      $('#myModal').modal('hide');
    })
    .catch((error) => {
      console.error("Error adding HR:", error);
      Swal.fire('Lỗi!', 'Thêm không thành công.', 'error');
    });
};

// // Edit HR
// const editHR = (id) => {
//   getEls("btnUpdate").style.display = "block";
//   getEls("modalHeader").innerHTML = "Cập Nhật Nhân Viên";
//   getEls("btnAdd").style.display = "none"; // Hiện input id
//   hrService.editHRAPI(id)
//     .then((result) => {
//       const hr = result.data;
//       // Điền thông tin vào form
//       getEls("idNhanVien").value = hr.id;
//       getEls("maNhanVien").value = hr.MSNV;
//       getEls("TenNV").value = hr.HoVaTen;
//       getEls("HDLD").value = hr.HDLD;
//       getEls("PhongBan").value = hr.PhongBan;
//       getEls("SDT").value = hr.SDT;
//       getEls("MBX").value = hr.MBX;
//       getEls("Mail").value = hr.Mail;
//       getEls("NgayVaoCT").value = hr.ThamNien; // Giả sử ThamNien là ngày vào công ty
//       getEls("Block").value = hr.Block;
//       getEls("CBQL").value = hr.CBQL;

//     })
//     .catch((error) => {
//       console.error("Error fetching HR data for edit:", error);
//     });
// };
// window.editHR = editHR;
// // Cập nhật nhân viên
// getEls("btnUpdate").onclick = function () {
//   // Lấy giá trị từ form
//   const nhanVienCapNhat = getValue();
//   // Gọi API cập nhật nhân viên
//   hrService.editHRAPI(nhanVienCapNhat.id, nhanVienCapNhat)
//     .then(() => {
//       Swal.fire('Thành công!', 'Nhân viên đã được cập nhật.', 'success');
//       getListHR();
//       // Đóng modal
//       $('#myModal').modal('hide');
//     })
//     .catch((error) => {
//       console.error("Error updating HR:", error);
//       Swal.fire('Lỗi!', 'Cập nhật không thành công.', 'error');
//     });
// };
// //Delete HR  dựa vào MSNV - Thông báo trước khi thực hiện xóa
// const deleteHR = (id, HoVaTen) => {
//   Swal.fire({
//     title: `Bạn có chắc muốn xóa ${HoVaTen}?`,
//     text: "Thao tác này không thể hoàn tác!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Xóa',
//     cancelButtonText: 'Hủy',
//   }).then((result) => {
//     if (result.isConfirmed) {
//       hrService.deleteHRAPI(id)
//         .then(() => {
//           Swal.fire('Đã xóa!', `Nhân viên ${HoVaTen} đã được xóa.`, 'success');
//           getListHR();
//         })
//         .catch((error) => {
//           console.error("Error deleting HR:", error);
//           Swal.fire('Lỗi!', 'Xóa không thành công.', 'error');
//         });
//     }
//   });
// };

// window.deleteHR = deleteHR;

// // Tìm kiếm nội dung trong bảng dựa vào từ khóa nhập vào
// const onSearch = () => {
//     const searchValue = getEls("txtTimKiem").value.toLowerCase();
//     const filteredList = hrService.array.filter(nv => nv.xeploai.toLowerCase().includes(searchValue));
//     renderListNhanVien(filteredList);
// };
// // Gọi hàm tìm kiếm khi người dùng nhập vào ô tìm kiếm
// getEls("txtTimKiem").addEventListener("input", onSearch);

// // Xuất Excel tbDanh Sách SP
// const onExportExcel = () => {
//   hrService.getListHRAPI().then((response) => {
//     const data = response.data;

//     // Tạo mảng dữ liệu
//     const worksheetData = [
//       ['STT', 'MSNV', 'Họ Và Tên', 'Hợp Đồng Lao Động', 'Phòng Ban', 'Số Điện Thoại', 'AccountMBX', 'Mail', 'Thâm Niên', 'Block', 'CBQL'],
//     ];
//     data.forEach((hr, index) => {
//       worksheetData.push([
//         index + 1,
//         hr.MSNV,
//         hr.HoVaTen,
//         hr.HDLD in hdldMAP ? hdldMAP[hr.HDLD] : hr.HDLD,
//         hr.PhongBan in phongBanMap ? phongBanMap[hr.PhongBan] : hr.PhongBan,
//         hr.SDT,
//         hr.MBX,
//         hr.Mail,
//         hr.ThamNien,
//         hr.Block,
//         hr.CBQL in cbqlMap ? cbqlMap[hr.CBQL] : hr.CBQL,
//       ]);
//     });

//     // Tạo sheet & workbook
//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSP");

//     // Xuất file
//     XLSX.writeFile(workbook, "list_nhan_su.xlsx");
//   });
// };
// window.onExportExcel = onExportExcel;

