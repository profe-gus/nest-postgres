import { User } from "./user.entity";

describe('UserEntity', () => {
    it('should create and User Instance', () => {
      const user = new User();
  
      expect(user).toBeInstanceOf(User);
    });
  
    it('should clear email before save', () => {
      const user = new User();
      user.email = ' gus@mail.com  ';
      user.checkFieldsBeforeInsert();
  
      expect(user.email).toBe('gus@mail.com');
    });
  
    it('should clear email before update', () => {
      const user = new User();
      user.email = ' GuS@mail.com    ';
      user.checkFieldsBeforeUpdate();
  
      expect(user.email).toBe('gus@mail.com');
    });
  });