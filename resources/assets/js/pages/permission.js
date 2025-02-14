'use strict';

$(function () {
  const MODAL_ADD_ROLE = $('#addRoleModal');
  const ROLE_TABLE = $('#roleTable');
  const FORM_PERMISSION_ADD = $('#addRoleForm')[0];

  const MODAL_EDIT_ROLE = $('#editRoleModal');
  const ROLE_TABLE_EDIT = $('#roleTableEdit');
  const FORM_PERMISSION_EDIT = $('#editRoleForm')[0];

  const MODAL_EDIT_ROLE_USER = $('#editRoleUserModal');
  const FORM_ROLE_USER_UPDATE = $('#editRoleUserForm')[0];

  const PERMISSION_SUBMIT_BTN_ADD = $('#btnSubmitAdd');
  const PERMISSION_SUBMIT_BTN_EDIT = $('#btnSubmitEdit');
  const PERMISSION_SUBMIT_BTN_ROLE_USER = $('#submitRoleUser');


  const LIST_CARD_ROLE = $('.list_card_role');
  const BTN_DELETE = '.btnDelete';
  const BTN_DELETE_USER = '.removeRoleUser';
  const BTN_EDIT_ROLE_USER = '.editRoleUser';

  const DT_USER_TABLE = $('.datatables-users');
  const SELECT_ROLE_USER = $('#selectRoleUser');

  let formPermissionEdit;
  let formPermissionAdd;
  let formRoleUser;

  let timeOut = 200;

  window.permission = {
    init              : function () {
      permission.ShowAddModalRole();
      permission.ShowEditModalRole();
      permission.CreateModalRole();
      permission.SelectAllCheckBox();
      permission.RenderBoxRoles();
      permission.DeleteRole();
      permission.OptionToast();
      permission.HandleModal();
      permission.EditModalRole();
      permission.ListUser();
      permission.ShowEditModalRoleUser();
      permission.UpdateModalRoleUser();
      permission.DeleteRoleUser();


    },
    OptionToast           : function () {
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: 'toast-top-center',
        preventDuplicates: false,
        onclick: null,
        showDuration: '3000',
        hideDuration: '1000',
        timeOut: '2000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut'
      };
    },
    ShowAddModalRole      : function () {
      $(MODAL_ADD_ROLE).on('show.bs.modal', function () {
        $.ajax({
          url: URL_GET_PERMISSIONS,
          method: 'get',
          success: function (req) {
            let html = '';
            html += `
                 ${Object.entries(req)
                   .map(
                     ([group, permissionList], index) => `
                       <div class="text-light fw-medium mt-3">${group}</div>
                        <div class="demo-inline-spacing mt-4">
                        <div class="list-group">
                        ${permissionList
                          .map(
                            permission => `
                              <label class="list-group-item">
                                <input class="form-check-input me-1 select-input" type="checkbox"  value="${permission.id}" data-id="${permission.id}" data-name="${permission.name}"/>
                                ${permission.name}
                              </label>
                              `
                          )
                          .join('')}

                        </div>
                      </div>
                        `
                   )
                   .join('')}
              `;
            $(ROLE_TABLE).html(html);
          },
          error: function (xhr, status, error) {
            let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

            // Kiểm tra nếu server trả về JSON lỗi
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            }

            toastr.error(errorMessage, 'Lỗi!');
          }
        });
      });
    },
    HandleModal           : function () {

      // Khi mở Modal
      $(MODAL_ADD_ROLE).on('shown.bs.modal', function () {

      });

      $(MODAL_EDIT_ROLE).on('shown.bs.modal', function () {
        let allChecked = true; // Giả định tất cả đều được check

        $('#editRoleForm .select-input').each(function () {
          if (!$(this).prop('checked')) {
            allChecked = false; // Nếu có ít nhất một checkbox không được check
            return false; // Thoát khỏi vòng lặp
          }
        });

        // Cập nhật trạng thái checkbox "Select All"
        $('#editRoleForm #selectAll').prop('checked', allChecked);
      });



      // Khi đóng Modal
      $(MODAL_ADD_ROLE).on('hide.bs.modal', function () {
        $('#name').val('');
        $('#selectAll').prop('checked', false);

        //Reset Form
        if (formPermissionAdd){
          formPermissionAdd.resetForm(true)
        }
      });

      $(MODAL_EDIT_ROLE).on('hide.bs.modal', function () {
        if (formPermissionEdit) {
          formPermissionEdit.resetForm(true);
        }
      });

      $(MODAL_EDIT_ROLE_USER).on('hide.bs.modal', function () {
        if (formRoleUser) {
          formRoleUser.resetForm(true);
        }
      });
    },
    CreateModalRole       : function () {
      formPermissionAdd = FormValidation.formValidation(FORM_PERMISSION_ADD, {
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập tên vai trò.'
              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Tên vai trò phải có từ 6 đến 255 ký tự'
              },
              blank: {}
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-1'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {
        let arrayRoles = [];

        $('#addRoleForm .select-input:checked').each(function () {
          arrayRoles.push($(this).data('name'));
        });

        const DATA = {
          name: $('#name').val(),
          arrayRoles: arrayRoles,
          _token: $('meta[name="csrf-token"]').attr('content')
        };

        $.ajax({
          url: URL_ADD_ROLE,
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '<span>Đang xử lý ...</span></div> ';
            PERMISSION_SUBMIT_BTN_ADD.html('').html(html).attr('disabled', true);
          },
          success: function (data) {
            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                MODAL_ADD_ROLE.modal('hide');

                // Render lại dũe liệu
                permission.RenderBoxRoles();
              }, timeOut);
            } else {
              toastr.error(data.message, 'Thất bại!');
            }
          },
          error: function (response) {
            // Hiện thông báo lỗi lỗi
            if (response.status === 403) {
              toastr.error('Bạn không có quyền truy cập.', 'Thất bại');
            }



            // Hiện thông báo lỗi trường input do server trả về
            let errors = response.responseJSON.errors;

            for (const field in errors) {
              let message = errors[field].join(', ');
              formPermission
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            PERMISSION_SUBMIT_BTN_ADD.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_ADD.prop('disabled', false);
          })
          .fail(function () {
            PERMISSION_SUBMIT_BTN_ADD.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_ADD.prop('disabled', false);
          });
      });
    },
    SelectAllCheckBox     : function () {
      // ModalAdd
      $('#addRoleForm #selectAll').on('click', function () {
        let isChecked = $(this).prop('checked'); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        $('#addRoleForm .select-input').prop('checked', isChecked); // Đặt trạng thái cho tất cả checkbox khác
      });

      $(document).on('click', ' #addRoleForm .select-input', function () {
        let allChecked = $('#addRoleForm .select-input').length === $('.select-input:checked').length;
        $('#addRoleForm #selectAll').prop('checked', allChecked);
      });

      // Modal Edit
      $('#editRoleForm #selectAll').on('click', function () {
        let isChecked = $(this).prop('checked'); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        $('#editRoleForm .select-input').prop('checked', isChecked); // Đặt trạng thái cho tất cả checkbox khác
      });

      $(document).on('click', ' #editRoleForm .select-input', function () {
        let allChecked = $('#editRoleForm .select-input').length === $('.select-input:checked').length;
        $('#editRoleForm #selectAll').prop('checked', allChecked);
      });
    },
    RenderBoxRoles        : function () {
      $.ajax({
        url: URL_RENDER_ROLE,
        method: 'get',
        success: function (req) {

          let data = req.data;

          if (req.success) {
            permission.HtmlBoxRoles(data);
          }
        },
        error: function (xhr, status, error) {
          let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

          // Kiểm tra nếu server trả về JSON lỗi
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
          }

          toastr.error(errorMessage, 'Lỗi!');
        }
      });
    },
    CheckPermission       : function(){
      $.ajax({
        url: URL_CHECK_PERMISSION,
        type: 'GET',
        dataType: 'json',
        data: { permission: permission },
        success: function(response) {
          console.log(response);
          callback(response.permission);
        },
        error: function () {
          // Trong trường hợp lỗi, coi như không có quyền
          callback(false);
        }
      });
    },
    HtmlBoxRoles          : function (data) {

      let html = '';
      $(data).each(function (key, item) {
        html += `
              <div class="col-xl-4 col-lg-6 col-md-6">
                  <div class="card h-100">
                      <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center mb-4">
                              <h6 class="fw-normal mb-0 text-body">Tổng số ${item.users.length} users</h6>
                              <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
              `;

        // Lặp qua tối đa 4 users đầu tiên
        item.users.slice(0, 4).forEach(user => {
          html += `
                              <li
                                  data-bs-toggle="tooltip"
                                  data-popup="tooltip-custom"
                                  data-bs-placement="top"
                                  title="${user.name}"
                                  class="avatar pull-up">
                                  <img class="rounded-circle" src="${user.avatar ? ASSETS_URL(user.avatar) : ASSETS_URL('assets/img/avatars/5.png')}" alt="Avatar" />
                              </li>
                          `;
        });

        // Nếu còn user, hiển thị +x user còn lại
        if (item.users.length > 4) {
          html += `
                      <li class="avatar">
                          <span
                              class="avatar-initial rounded-circle pull-up"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="${item.users.length - 4} more">
                              +${item.users.length - 4}
                          </span>
                      </li>
                  `;
        }

        html += `
                              </ul>
                          </div>
                          <div class="d-flex justify-content-between align-items-end">
                              <div class="role-heading">
                                  <h5 class="mb-1">${item.name}</h5>

                                   <a href="javascript:;" class="role-edit-modal btnEdit" data-id="${item.id}">
                                        <span>${item.name != 'Super Admin' ? 'Cập nhật' : ''}</span>
                                    </a>
                              </div>
                              ${item.name != 'Super Admin' ? '<a class="btnDelete" href="javascript:void(0);" data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title="Xoá" data-id="' + item.id + '"><i class="fa-solid fa-trash-can text-heading"></i></a>' : ''}
                          </div>
                      </div>
                  </div>
              </div>
              `;
      });
      html += `
            <div class="col-xl-4 col-lg-6 col-md-6">
              <div class="card h-100">
                <div class="row h-100">
                  <div class="col-sm-5">
                    <div class="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-4">
                      <img
                        src="${ASSETS_URL('assets/img/illustrations/add-new-roles.png')}"
                        class="img-fluid mt-sm-4 mt-md-0"
                        alt="add-new-roles"
                        width="83" />
                    </div>
                  </div>
                  <div class="col-sm-7">
                    <div class="card-body text-sm-end text-center ps-sm-0">
                      <button
                        data-bs-target="#addRoleModal"
                        data-bs-toggle="modal"
                        class="btn btn-sm btn-primary mb-4 text-nowrap add-new-role">
                        Thêm mới vai trò
                      </button>
                      <p class="mb-0">
                        Thêm vai trò mới,<br/>
                        nếu vai trò đó chưa tồn tại.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
      // Chèn HTML vào DOM
      $(LIST_CARD_ROLE).html(html);

      $('[data-bs-toggle="tooltip"]').tooltip();

      return html;
    },
    DeleteRole            : function () {
      $(document).on('click', BTN_DELETE, function () {
        let id = $(this).data('id');

        Swal.fire({
          title: 'Bạn có chắc muốn xoá?',
          text: 'Xoá là không thể khôi phục lại được!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đồng ý!',
          customClass: {
            confirmButton: 'btn btn-primary me-1',
            cancelButton: 'btn btn-label-secondary'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.isConfirmed) {
            $.ajax({
              url: URL_DELETE_ROLE,
              method: 'delete',
              dataType: 'json',
              data: {
                id: id
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
              },
              success: function (req) {
                if (req.success) {
                  toastr.success(req.message, 'Thành công!');

                  setTimeout(function () {
                    // Render lại dũe liệu
                    permission.RenderBoxRoles();

                    // Render lại table
                    DT_USER_TABLE.DataTable().ajax.reload(null,false);
                  }, timeOut);
                } else {
                  toastr.error(req.message, 'Thất bại!');
                }
              },
              error: function (xhr, status, error) {
                let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

                // Kiểm tra nếu server trả về JSON lỗi
                if (xhr.responseJSON && xhr.responseJSON.message) {
                  errorMessage = xhr.responseJSON.message;
                }

                toastr.error(errorMessage, 'Lỗi!');
              }
            });
          }
        });
      });
    },
    ShowEditModalRole     : function () {
      $(document).on('click', '.btnEdit', function () {
        let roleId = $(this).data('id'); // Lấy ID từ button
        MODAL_EDIT_ROLE.data('id', roleId); // Gán ID vào modal
        MODAL_EDIT_ROLE.modal('show');
      });

      $(MODAL_EDIT_ROLE).on('show.bs.modal', function (event) {
        $.ajax({
          url: URL_GET_EDIT_PERMISSIONS,
          method: 'get',
          data: {
            id: $(this).data('id')
          },
          success: function (req) {
            let data = req?.data?.dataPermission;
            let permissionArray = req?.data?.getArrayIdPermission;
            let roleName = req?.data?.roleName;

            let html = '';

            if (req.success){
              $('#editRoleForm #name').val(roleName)

              html += `
                 ${Object.entries(data)
                .map(
                  ([group, permissionList], index) => `
                       <div class="text-light fw-medium mt-3">${group}</div>
                        <div class="demo-inline-spacing mt-4">
                        <div class="list-group">
                        ${permissionList
                    .map(
                      permission => `
                              <label class="list-group-item">
                                <input class="form-check-input me-1 select-input" type="checkbox"  value="${permission.id}" data-id="${permission.id}" data-name="${permission.name}" ${permissionArray.includes(permission.id) ? 'checked' : ''}/>
                                ${permission.name}
                              </label>
                              `
                    )
                    .join('')}

                        </div>
                      </div>
                        `
                )
                .join('')}
              `;
              $(ROLE_TABLE_EDIT).html(html);
            }

          },
          error: function (xhr, status, error) {
            let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

            // Kiểm tra nếu server trả về JSON lỗi
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            }

            toastr.error(errorMessage, 'Lỗi!');
          }
        });
      });
    },
    EditModalRole         : function(){
      formPermissionEdit = FormValidation.formValidation(FORM_PERMISSION_EDIT, {
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: 'Vui lòng nhập tên vai trò.'
              },
              stringLength: {
                min: 6,
                max: 255,
                message: 'Tên vai trò phải có từ 6 đến 255 ký tự'
              },
              blank: {}
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-1'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus()
        },
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {
        let arrayRoles = [];

        $('#editRoleForm .select-input:checked').each(function () {
          arrayRoles.push($(this).data('name'));
        });

        const DATA = {
          name: $('#editRoleForm #name').val(),
          id: MODAL_EDIT_ROLE.data('id'),
          arrayRoles: arrayRoles,
          _token: $('meta[name="csrf-token"]').attr('content')
        };

        $.ajax({
          url: URL_EDIT_ROLE,
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '<span>Đang xử lý ...</span></div> ';
            PERMISSION_SUBMIT_BTN_EDIT.html('').html(html).attr('disabled', true);
          },
          success: function (data) {
            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                MODAL_EDIT_ROLE.modal('hide');

                // Render lại dũe liệu
                permission.RenderBoxRoles();
              }, timeOut);
            } else {
              toastr.error(data.message, 'Thất bại!');
            }
          },
          error: function (response) {
            // Hiện thông báo lỗi lỗi
            if (response.responseJSON.success === false) {
              toastr.error(response.responseJSON.message, 'Thất bại');
            }

            // Hiện thông báo lỗi trường input do server trả về
            let errors = response.responseJSON.errors;

            for (const field in errors) {
              let message = errors[field].join(', ');
              formPermission
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            PERMISSION_SUBMIT_BTN_EDIT.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_EDIT.prop('disabled', false);
          })
          .fail(function () {
            PERMISSION_SUBMIT_BTN_EDIT.html('Xác nhận');
            PERMISSION_SUBMIT_BTN_EDIT.prop('disabled', false);
          });
      });


    },
    ListUser              : function(){

      var dtUser = DT_USER_TABLE.DataTable({
        ajax: URL_GET_USERS, // JSON file to add data
        columns: [
          { data: 'id' },

          { data: 'email_qß' },
          { data: 'role' },
          { data: 'status' },
          { data: '' } // Actions
        ],
        columnDefs: [
          {
            // Responsive control column
            className: 'control',
            orderable: false,
            searchable: false,
            responsivePriority: 2,
            targets: 0,
            width:'50px',
            render: function (data, type, full, meta) {
              return ''; // Plugin Responsive sẽ tự chèn icon
            }
          },
          {
            // USER column
            targets: 1,
            title: 'USER',
            orderable: false,
            responsivePriority: 4,
            render: function (data, type, full, meta) {
              let avatar = full.avatar;

              // Ví dụ: hiển thị tên cùng email
              const html = `
                <div class="d-flex justify-content-left align-items-center">
                  <div class="avatar-wrapper">
                    <div class="avatar avatar-sm me-4">
                      ${avatar ? `<img src="${avatar}" alt="Avatar" class="rounded-circle">` : `<img src="${ASSETS_URL('assets/img/avatars/5.png')}" alt="Avatar" class="rounded-circle">`}
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <a href="#" class="text-heading text-truncate">
                      <span class="fw-medium">${full.name}</span>
                    </a>
                    <small>${full.email}</small>
                  </div>
                </div>`;
              return html;
            }
          },
          {
            // Role column
            title: 'Role',
            targets: 2,
            orderable: false,
            render: function (data, type, full, meta) {
              if (full?.roles[0]?.name != undefined){
                return `<span class="badge bg-info">${full?.roles[0]?.name}</span>`;
              }else{
                return `<span class="badge bg-warning">User</span>`;
              }
            }
          },
          {
            // Status column
            title: 'Status',
            targets: 3,
            orderable: false,
            render: function (data, type, full, meta) {
              // Ví dụ: hiển thị status với màu sắc
              var html = '';
              if (data == STATUS_USER_KEY['Inactive']){
                return `<span class="badge bg-glow ${STATUS_USER_CLASS[data]}">${STATUS_USER_TEXT[data]}</span>`;
              }else if (data == STATUS_USER_KEY['Active']){
                return `<span class=" badge bg-glow ${STATUS_USER_CLASS[data]}">${STATUS_USER_TEXT[data]}</span>`;
              }

            }
          },
          {
            // Actions column
            targets: -1,
            title: 'Actions',
            searchable: false,
            orderable: false,
            width:'100px',
            render: function (data, type, full, meta) {

              return (
                '<div class="d-flex align-items-center">' +
                '<a href="javascript:;" data-id="'+full.id+'" data-role="'+full?.roles[0]?.name+'" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record editRoleUser" data-bs-toggle="tooltip"\n' +
                '                     data-bs-placement="top" data-bs-original-title="Cập nhật">' +
                '<i class="ti ti-edit"></i>' +
                '</a>' +
                '<a href="javascript:;" data-id="'+full.id+'" data-role="'+full?.roles[0]?.name+'" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record removeRoleUser" data-bs-toggle="tooltip"\n' +
                '                     data-bs-placement="top" data-bs-original-title="Xoá quyền">' +
                '<i class="ti ti-trash"></i>' +
                '</a>' +
                '</div>'
              );
            }
          }
        ],
        order: [[2, 'desc']],
        searching: false,

        language: {
          sLengthMenu: 'Show _MENU_',
          search: '',
          searchPlaceholder: 'Search User',
          paginate: {
            next: '<i class="ti ti-chevron-right ti-sm"></i>',
            previous: '<i class="ti ti-chevron-left ti-sm"></i>'
          }
        },
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function (row) {
                var data = row.data();
                return 'Details of ' + data['full_name'];
              }
            }),
            type: 'column',
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                  ? '<tr data-dt-row="' +
                  col.rowIndex +
                  '" data-dt-column="' +
                  col.columnIndex +
                  '">' +
                  '<td>' +
                  col.title +
                  ':' +
                  '</td> ' +
                  '<td>' +
                  col.data +
                  '</td>' +
                  '</tr>'
                  : '';
              }).join('');

              return data ? $('<table class="table"/><tbody />').append(data) : false;
            }
          }
        },
      });

      dtUser.on('draw.dt', function () {
        $('[data-bs-toggle="tooltip"]').tooltip(); // Khởi tạo lại tooltip sau mỗi lần render
      });
    },
    ShowEditModalRoleUser : function () {
      $(document).on('click', BTN_EDIT_ROLE_USER, function () {
        let roleUserId  = $(this).data('id')
        let roleName    = $(this).data('role')
        MODAL_EDIT_ROLE_USER.data('id', roleUserId);
        MODAL_EDIT_ROLE_USER.data('roleName', roleName);
        MODAL_EDIT_ROLE_USER.modal('show');
      });

      $(MODAL_EDIT_ROLE_USER).on('show.bs.modal', function (event) {
        let roleName = $(this).data('roleName')
        $.ajax({
          url: URL_RENDER_ROLE,
          method: 'get',
          data: {
            id: $(this).data('id')
          },
          success: function (req) {
              let data = req.data;
              let html = '';
              html += `<option value="" >Chọn quyền</option>`;
              $(data).each(function(key,item){
                let selected = roleName === item.name ? 'selected' : ''; // Kiểm tra nếu trùng roleName thì chọn
                html += `<option value="${item.name}" ${selected}>${item.name}</option>`;
              })

            SELECT_ROLE_USER.html(html)

          },
          error: function (xhr, status, error) {
            let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

            // Kiểm tra nếu server trả về JSON lỗi
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            }

            toastr.error(errorMessage, 'Lỗi!');
          }
        });
      });
    },
    UpdateModalRoleUser   : function(){
      formRoleUser = FormValidation.formValidation(FORM_ROLE_USER_UPDATE, {
        fields: {
          role: {
            validators: {
              callback: {
                message: 'Vui lòng chọn vai trò.',
                callback: function(input) {
                  console.log(input.value == "");
                  return input.value !== ""; // Trả về false nếu giá trị là rỗng
                }
              },
              blank: {}
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap5: new FormValidation.plugins.Bootstrap5({
            eleValidClass: '',
            rowSelector: '.mb-3'
          }),
          submitButton: new FormValidation.plugins.SubmitButton(),
          autoFocus: new FormValidation.plugins.AutoFocus()
        },
        excluded: false,
        init: instance => {
          instance.on('plugins.message.placed', function (e) {
            if (e.element.parentElement.classList.contains('input-group')) {
              e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
            }
          });
        }
      }).on('core.form.valid', function (e) {


        const DATA = {
          name: SELECT_ROLE_USER.val(),
          id : MODAL_EDIT_ROLE_USER.data('id'),
          _token: $('meta[name="csrf-token"]').attr('content')
        };


        $.ajax({
          url: URL_UPDATE_ROLE_USER,
          method: 'post',
          data: DATA,
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            var html =
              '<div class="d-flex justify-content-center align-items-center;">' +
              '<span class="spinner-border me-2 " style="width: 20px; height: 20px" role="status" aria-hidden="true"></span> ' +
              '</div> ';
              PERMISSION_SUBMIT_BTN_ROLE_USER.html('').html(html).attr('disabled', true);
          },
          success: function (data) {
            if (data.success === true) {
              // Hiện thông báo đăng nhập thành công.
              toastr.success(data.message, 'Thành công!');

              setTimeout(function () {
                MODAL_EDIT_ROLE_USER.modal('hide');

                // Load table
                DT_USER_TABLE.DataTable().ajax.reload(null,false);
                permission.RenderBoxRoles();
              }, timeOut);
            } else {
              toastr.error(data.message, 'Thất bại!');
            }
          },
          error: function (response) {
            // Hiện thông báo lỗi lỗi
            if (response.responseJSON.success === false) {
              toastr.error(response.responseJSON.message, 'Thất bại');
            }

            // Hiện thông báo lỗi trường input do server trả về
            let errors = response.responseJSON.errors;

            for (const field in errors) {
              let message = errors[field].join(', ');
              formRoleUser
                // Update the message option
                .updateValidatorOption(field, 'blank', 'message', message)
                // Set the field as invalid
                .updateFieldStatus(field, 'Invalid', 'blank');
            }
          }
        })
          .done(function () {
            PERMISSION_SUBMIT_BTN_ROLE_USER.html('Update');
            PERMISSION_SUBMIT_BTN_ROLE_USER.prop('disabled', false);
          })
          .fail(function () {
            PERMISSION_SUBMIT_BTN_ROLE_USER.html('Update');
            PERMISSION_SUBMIT_BTN_ROLE_USER.prop('disabled', false);
          });
      });
    },
    DeleteRoleUser        : function () {
      $(document).on('click', BTN_DELETE_USER, function () {
        let id = $(this).data('id');
        let nameRole = $(this).data('role');

        Swal.fire({
          title: 'Bạn có chắc muốn xoá?',
          text: 'Xoá là không thể khôi phục lại được!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đồng ý!',
          customClass: {
            confirmButton: 'btn btn-primary me-1',
            cancelButton: 'btn btn-label-secondary'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.isConfirmed) {
            $.ajax({
              url: URL_DELETE_ROLE_USER,
              method: 'delete',
              dataType: 'json',
              data: {
                id: id,
                nameRole : nameRole
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
              },
              success: function (req) {
                if (req.success) {
                  toastr.success(req.message, 'Thành công!');

                  setTimeout(function () {
                    // Render lại dũe liệu
                    permission.RenderBoxRoles();

                    // Render lại table
                    DT_USER_TABLE.DataTable().ajax.reload(null,false);
                  }, timeOut);
                } else {
                  toastr.error(req.message, 'Thất bại!');
                }
              },
              error: function (xhr, status, error) {
                let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';

                // Kiểm tra nếu server trả về JSON lỗi
                if (xhr.responseJSON && xhr.responseJSON.message) {
                  errorMessage = xhr.responseJSON.message;
                }

                toastr.error(errorMessage, 'Lỗi!');
              }
            });
          }
        });
      });
    },
  };

  $(document).ready(function () {
    permission.init();
  });
});
