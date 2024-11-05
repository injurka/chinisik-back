export async function mockUser() {
  return [{
    name: 'test',
    email: 'test@test.test',
    password: await Bun.password.hash('testtesttest'),
  }]
}
