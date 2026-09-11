import {PrismaClient} from "@repo/db/client"
import Balance from "./component/Balance"

const client = new PrismaClient()

export default function Home() {
  return (
    <div className="text-2xl">
      hi there
      <Balance />
    </div>
  );
}
