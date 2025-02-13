<?php

namespace App\Services;
use App\Helpers\ResponseHelper;
use App\Models\User;
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

  public function editRole($request)
  {
    $id         = $request->input('id');
    $name       = $request->input('name');
    $arrayRoles = $request->input('arrayRoles');

    try{
      $role = $this->getFindId($id);
      if($role){
        $role->update(['name' => $name]);
        $role->syncPermissions($arrayRoles);

        return ResponseHelper::senSucess('Cập nhật vai trò thành công!');
      }

      return ResponseHelper::senError('Cập nhật dữ liệu thất bại! Vui lòng thử lại.');
    }catch (\Exception $exception){
      logger('Error: PermissionController - editRole - Message: '.$exception->getMessage());
      return ResponseHelper::senError('Lỗi hệ thống vui lòng liên hệ quản trị viên.');
    }
  }

  public function getUserList($request)
  {
      $search_input = $request->input('search');
      $users = User::with('roles')
                      ->when($search_input,function ($query) use($search_input){
                          $query->where('name','like','%'.$search_input.'%');
                          $query->orWhere('email','like','%'.$search_input.'%');
                      })
                      ->get();

      return response()->json([
        'data' => $users,
      ]);
  }

  public function getFindId($id)
  {
    return Role::find($id);
  }

  public function getEditPermissions($request)
  {
      $id = $request->input('id');

      $getRolePermission = Role::with('permissions')->where('id',$id)->first();

      $roleName = $getRolePermission->name;

      $getArrayIdPermission = $getRolePermission->permissions->pluck('id');



      $getPermission = $this->getPermissions();


      return ResponseHelper::senSucess('Lấy dữ liệu thành công.',[
        'dataPermission' => $getPermission,
        'getArrayIdPermission' => $getArrayIdPermission,
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
