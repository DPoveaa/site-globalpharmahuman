import { Router } from "express";

const router = Router();

router.use((_req, res) => {
  return res.status(404).json({ message: "Rota de avaliações não implementada no backend atual." });
});

export default router;
