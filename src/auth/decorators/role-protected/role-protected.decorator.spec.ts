import { SetMetadata } from "@nestjs/common";
import { RoleProtected, META_ROLES } from "./role-protected.decorator";
import { ValidRoles } from "../../enums/valid-roles.enum";

jest.mock('@nestjs/common', () => ({
    SetMetadata: jest.fn(),
  }));
  
  describe('RoleProtected Decorator', () => {
    it('should set metadata with the correct roles', () => {
      const roles = [ValidRoles.admin, ValidRoles.teacher];
  
      const result = RoleProtected(...roles);
  
      expect(SetMetadata).toHaveBeenCalled();
      expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles);
  
    });
  });