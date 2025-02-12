<?php

namespace App\Services;
use App\Helpers\ResponseHelper;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class PermissionService
{
  public function getPermissions()
  {
      $getAllPermissions = Permission::select(['id','name','group'])->get()->groupBy('group')->toArray();
      return $getAllPermissions;
  }

  public function getRoles()
  {
    $data =  Role::with('users')->get();
    return ResponseHelper::senSucess('Lấy dữ liệu thành công.',$data);
  }

  public function addRole($request)
  {
    $name       = $request->input('name');
    $arrayRoles = $request->input('arrayRoles');


    try{
      $role = Role::create(['name' => $name]);
      if($role){
        $role->syncPermissions($arrayRoles);

        return ResponseHelper::senSucess('Thêm mới vai trò thành công!');
      }

      return ResponseHelper::senError('Thêm mới dữ liệu thất bại! Vui lòng thử lại.');
    }catch (\Exception $exception){
      logger('Error: PermissionController - addRole - Message: '.$exception->getMessage());
      return ResponseHelper::senError('Lỗi hệ thống vui lòng liên hệ quản trị viên.');
    }
  }

  public function getFindId($id)
  {
    return Role::find($id);
  }

  public function getEditPermissions($request)
  {
      $id = $request->input('id');

      $getRolePermission = Role::with('permissions')->where('id',$id)->first()->permissions->pluck('id');

      $roleName = $getRolePermission->name;

      $getPermission = $this->getPermissions();


      return ResponseHelper::senSucess('Lấy dữ liệu thành công.',[
        'dataPermission' => $getPermission,
        'getRolePermission' => $getRolePermission,
        'roleName' => $roleName
      ]);
  }

  public function deleteRole($request)
  {
      try{
        $id = $request->id;

        $findRole = $this->getFindId($id);

        if($findRole){
          $findRole->delete();

          return ResponseHelper::senSucess('Xoá dữ liệu thành công.');
        }
        return ResponseHelper::senError('Không thể xoá vào lúc này. Vui lòng thử lại sau ít phút!');
      }catch (\Exception $exception){
        logger('Error: PermissionController - deleteRole - Message: '.$exception->getMessage());
        return ResponseHelper::senError('Lỗi hệ thống vui lòng liên hệ quản trị viên.');
      }
  }
}
