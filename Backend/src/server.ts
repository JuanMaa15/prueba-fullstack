import { app } from '@/app.ts';
import { env } from '@/common/config/env.ts';

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
