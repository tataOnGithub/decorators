import { getUserById, User } from "./users";

const btn = <HTMLElement>document.getElementById("btn");
const input = <HTMLElement>document.getElementById("userId");
const loading = <HTMLElement>document.getElementById("loading");


const  memo = (x: number): any => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const cache = new Map();
    const idFromInput = input as HTMLInputElement;
    const originalMethod = descriptor.value;

    descriptor.value = async function() {
      if (cache.has(idFromInput.value)) {
        let userInCache = cache.get(idFromInput.value);
        return new Promise((res) => {
          res(userInCache);
        });
      } else {
        return await originalMethod(+idFromInput.value).then((user: User) => {
          cache.set(idFromInput.value, user);
          cache.delete(idFromInput.value);
          return user;
        });
      };
    };
  };
};

class UsersService {
  @memo(1) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
};

const usersService = new UsersService();

btn.addEventListener("click", async () => {
  loading.innerHTML = "loading";
  await usersService
    .getUserById(+(input as HTMLInputElement).value)
    .then((x) => console.log(x));
  loading.innerHTML = "";
});
