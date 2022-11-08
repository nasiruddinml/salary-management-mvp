-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "salary" DECIMAL NOT NULL DEFAULT 0.00
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_id_key" ON "employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_username_key" ON "employee"("username");
