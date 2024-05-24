import { rest } from 'msw';
const baseURL = 'http://localhost/api/'

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        "pk": 3,
        "username": "Luka",
        "email": "",
        "first_name": "",
        "last_name": "",
        "profile_id": 3,
        "profile_image": "https://res.cloudinary.com/dfhay1cmj/image/upload/v1/media/images/user_4558377_giqsps"
        })
    )
  }),
  rest.post(`${baseURL}dj-rest-auth/token/refresh/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ access: 'fake-access-token' }));
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  // Handler for fetching user data
  rest.get(`${baseURL}/dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: 1, username: 'testuser', email: 'testuser@example.com' })
    );
  }),

  // Handlers for iconify API
  rest.get('https://api.iconify.design/gg.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ icons: { gg: { body: '<svg></svg>' } } })
    );
  }),
  rest.options('https://api.iconify.design/gg.json', (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Handlers for unisvg API
  rest.get('https://api.unisvg.com/gg.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ icons: { gg: { body: '<svg></svg>' } } })
    );
  }),
  rest.options('https://api.unisvg.com/gg.json', (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Handlers for simplesvg API
  rest.get('https://api.simplesvg.com/gg.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ icons: { gg: { body: '<svg></svg>' } } })
    );
  }),
  rest.options('https://api.simplesvg.com/gg.json', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
