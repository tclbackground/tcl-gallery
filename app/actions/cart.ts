model CartItem {
  id String @id @default(auto()) @map("_id") @db.ObjectId

  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId String @db.ObjectId
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  size String?
  frame String?

  price Float
  quantity Int @default(1)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}