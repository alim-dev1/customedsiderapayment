"use client";

import { useParams } from "next/navigation";
import Table from "@/components/Table/Table";

export default function Home() {
  //  get an id
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Table id={id} />
    </>
  );
}
