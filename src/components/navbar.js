import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { handlerLogin as loginUser } from "@/pages/api/users/login";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLogin, setIsLogin] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <Flex
      w="full"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="#2A5C91"
      color="white"
    >
      <Link href="/">
        <Flex align="center" mr={5} cursor="pointer">
          <Text fontSize="3xl" fontWeight="bold">
            FindBooks
          </Text>
        </Flex>
      </Link>
      <HStack>
        {isLogin && (
          <Link href="/newbook">
            <Button colorScheme="blackAlpha">Create New Book</Button>
          </Link>
        )}
        {!isLogin ? (
          <>
          <Link href="/register">
            <Button colorScheme="blackAlpha">Register</Button>
          </Link>
          <Button onClick={onOpen} colorScheme="blue">
            Login
          </Button>
          </>
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => {
              window.localStorage.removeItem("token");
              setIsLogin(false);
              toast({
                title: "Success",
                description: "Logout Success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
            }}
          >
            Logout
          </Button>
        )}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <form
          id="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const token = await loginUser(
                e.target.email.value,
                e.target.password.value
              );
              window.localStorage.setItem("token", token.token);
              toast({
                title: "Success",
                description: "Login Success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
              onClose();
            } catch (err) {
              toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" form="login-form" colorScheme="blue" mr={3}>
                Login
              </Button>
              <Link href="/register" onClick={onClose}>
                <Button variant="ghost">
                  Doesn't Have Account? Click here
                </Button>
              </Link>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Flex>
  );
};

export default Navbar;
