# CashiConnect API — Feature Requirements

এই নথিতে farmer profile, farming project, project update এবং harvest-এর ১৮টি feature-এর role, endpoint, সংশ্লিষ্ট table ও প্রত্যাশিত আচরণ লেখা আছে। অ্যাপের global prefix `/api`; তাই code-এ `/projects` route থাকলে সম্পূর্ণ URL হবে `/api/projects`।

## Feature ও endpoint তালিকা

| # | Feature | অনুমোদিত role | Endpoint | Table |
|---|---|---|---|---|
| 1 | Farmer profile তৈরি | Farmer | `POST /api/farmer-profiles` | `farmer_profiles` |
| 2 | নিজের profile দেখা ও update | Farmer | `GET`, `PATCH /api/farmer-profiles/:id` | `farmer_profiles` |
| 3 | Farmer-কে verify বা reject করা; কাজের log রাখতে হবে | Admin | `PATCH /api/farmer-profiles/:id/verify` | `farmer_profiles` এবং verification log |
| 4 | Farmer-দের list ও profile দেখা, যেমন hire করার জন্য | Admin, Landowner | `GET /api/farmer-profiles`, `GET /api/farmer-profiles/:id` | `farmer_profiles` |
| 5 | Available জমি বেছে farming project তৈরি; জমি reserved হবে | Farmer | `POST /api/projects` | `farming_projects`, `lands` |
| 6 | নিজের সব project দেখা | Farmer | `GET /api/projects/my` | `farming_projects` |
| 7 | Status দিয়ে project list filter; Investor কেবল approved/active project দেখবে | সব user | `GET /api/projects` | `farming_projects` |
| 8 | Project details-এ মোট funding ও funded percentage দেখানো | সব user | `GET /api/projects/:id` | `farming_projects`, `investments` |
| 9 | নিজের project edit করা | Farmer | `PATCH /api/projects/:id` | `farming_projects` |
| 10 | শুধু pending project delete করা | Farmer | `DELETE /api/projects/:id` | `farming_projects` |
| 11 | Pending project approve করা; কাজের log রাখতে হবে | Admin | `PATCH /api/projects/:id/approve` | `farming_projects` এবং approval log |
| 12 | Project reject করা; কাজের log রাখতে হবে | Admin | `PATCH /api/projects/:id/reject` | `farming_projects` এবং rejection log |
| 13 | Project-এর milestone, অগ্রগতির শতাংশ ও খরচসহ update দেওয়া | Farmer | `POST /api/project-updates` | `project_updates` |
| 14 | নিজের project update edit বা delete করা | Farmer | `PATCH`, `DELETE /api/project-updates/:id` | `project_updates` |
| 15 | একটি project-এর progress timeline দেখা | সব user | `GET /api/projects/:id/updates` | `project_updates` |
| 16 | Harvest record দেওয়া: পরিমাণ, বিক্রির পরিমাণ ও এককপ্রতি দাম | Farmer | `POST /api/harvests` | `harvests` |
| 17 | নিজের harvest record edit বা delete করা | Farmer | `PATCH`, `DELETE /api/harvests/:id` | `harvests` |
| 18 | Project-এর harvest summary দেখা: মোট উৎপাদন, বিক্রি ও মোট value | সব user | `GET /api/projects/:id/harvest-summary` | `harvests` |

## গুরুত্বপূর্ণ নিয়ম

- Farmer-এর পরিচয় request body থেকে নয়, authenticated user/JWT থেকে নিতে হবে। Farmer অন্য কারও profile, project, update বা harvest পরিবর্তন করতে পারবে না।
- Project তৈরি করার সময় নির্বাচিত জমি available থাকতে হবে। Project তৈরি সফল হলে একই operation-এ জমির status reserved করতে হবে; জমি unavailable হলে project তৈরি করা যাবে না।
- নতুন project-এর প্রাথমিক status হবে `pending`। Farmer কেবল নিজের pending project edit বা delete করতে পারবে।
- Admin-এর approve/reject এবং farmer verification/rejection-এর actor, action, target record, সময় এবং rejection reason থাকলে সেটি সংরক্ষণ করতে হবে।
- Investor project list-এ কেবল approved/active status দেখতে পারবে। অন্য user status filter ব্যবহার করে project list চাইতে পারবে।
- Funded percentage হিসাব: `eligible investment total / required_funding * 100`। Investment-এর কোন status eligible হবে, সেটি investment workflow-এর সঙ্গে একইভাবে নির্ধারণ করতে হবে।
- Harvest summary হিসাব: সব harvest-এর `quantity`-এর যোগফল, `sold_quantity`-এর যোগফল, এবং `sold_quantity * selling_price_per_unit`-এর যোগফল।
- Progress timeline project অনুযায়ী update date-এর ক্রমে ফেরত দিতে হবে।

## DTO-তে থাকা প্রত্যাশিত data

- **Farmer profile:** অভিজ্ঞতার বছর, specialization, bio (ঐচ্ছিক), address। `user_id` ও verification status client নির্ধারণ করবে না।
- **Farming project:** title (ঐচ্ছিক), crop name, description, required funding, start date, end date; জমি বাছাইয়ের জন্য `land_id` লাগবে। `farmer_id` ও status server নির্ধারণ করবে।
- **Project update:** `project_id`, milestone, progress percentage (০–১০০), description, expense amount, update date। Project ownership server যাচাই করবে।
- **Harvest:** `project_id`, quantity, unit, sold quantity, selling price per unit, harvest date, description (ঐচ্ছিক)। Project ownership server যাচাই করবে।

## Table-গুলোর দায়িত্ব

- `farmer_profiles`: farmer-এর profile ও verification status।
- `farming_projects`: project details, owner farmer profile এবং project status।
- `lands`: জমির মালিকানা/বিবরণ এবং available/reserved status।
- `investments`: project-এ বিনিয়োগের পরিমাণ ও investment status; details response-এর funding গণনায় লাগে।
- `project_updates`: project milestone, progress, খরচ ও update date।
- `harvests`: project-এর উৎপাদন ও বিক্রির record।
- Admin action log table: verification, approval ও rejection-এর audit history।

## Status এবং schema বিষয়ে সিদ্ধান্ত দরকার

এই feature list-এ জমি ও investment-এর table উল্লেখ আছে, কিন্তু তাদের column, owner relationship, investment status, এবং কোন status-এর investment funding-এ গণনা হবে—তা নির্দিষ্ট করা নেই। Implementation-এর আগে এগুলোর schema ও business rule স্থির করতে হবে। একইভাবে project status-এর `approved` বনাম `active` transition-ও পরিষ্কার করা দরকার।
