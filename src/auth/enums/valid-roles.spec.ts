import { ValidRoles } from "./valid-roles.enum";

describe('Valid roles Enum', () => {
    it('should have correct values', () => {
      expect(ValidRoles.admin).toBe('admin');
      expect(ValidRoles.superUser).toBe('super-user');
      expect(ValidRoles.teacher).toBe('teacher');
    });
  
    it('should contain all expected values', () => {
      const keyToHave = ['admin', 'super-user', 'teacher'];
  
      expect(Object.values(ValidRoles)).toEqual(
        expect.arrayContaining(keyToHave),
      );
    });
  });