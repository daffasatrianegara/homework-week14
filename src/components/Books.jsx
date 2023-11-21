import { Card, Heading, Image, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function Books({ id, title, author, image, publisher, year }) {
  return (
    <Link href={`/details/${id}`}>
      <Card key={id} my={2} p={4} m={5} cursor="pointer">
        <VStack>
          <Heading size={"md"}>
            {title} ({year})
          </Heading>
          <Text>{author}</Text>
          <Image w={24} h={24} src={`${image}`} alt={`${id}-${title}`} />
          <Text>
            <span>Publisher: </span>
            {publisher}
          </Text>
        </VStack>
      </Card>
    </Link>
  );
}