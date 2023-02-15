import Header from "../Header";
import Image from "next/image";
import {
  HiAtSymbol,
  HiMap,
  HiPencilAlt,
  HiPhone,
  HiUserCircle,
  HiX,
} from "react-icons/hi";
import { IoPaw } from "react-icons/io5";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import { Popover } from "@headlessui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  FreelancePetSitterProfileType,
  PetSitterProfileType,
  UserProfile,
} from "../../types/user";

type FreelancePetSitterProfileProps = {
  editable: boolean;
  user: UserProfile & PetSitterProfileType & FreelancePetSitterProfileType;
};

const formDataSchema = z.object({
  firstNameLastName: z.string().min(1),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Invalid phone number" }),
  address: z.string().min(1, { message: "Required" }),
  email: z.string().email(),
  petTypes: z.string().array(),
});

type FormData = z.infer<typeof formDataSchema>;

// A list of pet types
// TODO: Get this from somewhere else, instead of hardcoding here.
const petTypesList = [
  "Dog",
  "Cat",
  "Hamster",
  "Fish",
  "Mouse",
  "Bird",
  "Snake",
  "Iguana",
  "Ferret",
].sort();

const FreelancePetSitterProfile = (props: FreelancePetSitterProfileProps) => {
  const utils = api.useContext();
  const updateFreelancePetSitter = api.freelancePetSitter.update.useMutation();
  const updatePetSitter = api.petSitter.update.useMutation();
  const updateUser = api.user.update.useMutation();
  const [editing, setEditing] = useState(false);

  const profileImageUri = props.user
    ? props.user.imageUri
      ? props.user.imageUri
      : "/profiledummy.png"
    : "/profiledummy.png";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: FormData) => {
    const [firstName, lastName] = data.firstNameLastName.split(" ");
    const petTypesArray: string[] = data.petTypes;
    await updateFreelancePetSitter.mutateAsync({
      userId: props.user.userId,
      data: { firstName: firstName, lastName: lastName },
    });
    await updatePetSitter.mutateAsync({
      userId: props.user.userId,
      data: {
        petTypes: petTypesArray,
        verifyStatus: props.user.verifyStatus,
      },
    });
    await updateUser.mutateAsync({
      userId: props.user.userId,
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });
    // Refetch user data
    // console.log("Invalidating cache");
    await utils.user.getByUsername.invalidate({
      username: props.user.username,
    });

    setEditing(false);
  };

  return (
    <div>
      <Header></Header>
      <div className="mx-3 flex flex-wrap">
        <div className="my-auto flex w-screen flex-col md:w-1/5 md:min-w-min ">
          <div className="relative mx-auto flex h-[6rem] w-[6rem]">
            <Image
              src={profileImageUri}
              alt={"Icon"}
              fill
              className="rounded-xl"
            ></Image>
          </div>
          <h1 className="mx-auto my-1 text-center text-2xl font-semibold">
            {props.user.username}
          </h1>

          {props.editable && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="profile-edit-button"
            >
              Edit my profile&nbsp;
              <HiPencilAlt className="mt-auto mb-[0.2rem] ml-1 fill-white" />
            </button>
          )}
        </div>

        {!editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            <p className="data-field">
              <HiUserCircle className="profile-icon" />
              &nbsp;Name: {props.user.firstName} {props.user.lastName}
            </p>
            <p className="data-field">
              <HiPhone className="profile-icon" />
              &nbsp;Phone: {props.user.phoneNumber}
            </p>
            <p className="data-field">
              <HiMap className="profile-icon" />
              &nbsp;Address: {props.user.address}
            </p>
            <p className="data-field">
              <HiAtSymbol className="profile-icon" />
              &nbsp;Email: {props.user.email}
            </p>
            <p className="data-field">
              <IoPaw className="profile-icon" />
              &nbsp;Pet Types:&nbsp;
              <span className="mt-1 inline-flex flex-wrap gap-2">
                {props.user.petTypes.map((petType) => (
                  <span
                    key={petType}
                    className="rounded-xl bg-slate-200 pl-2 pr-2"
                  >
                    {petType}
                  </span>
                ))}
              </span>
            </p>
          </div>
        )}
        {editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* register your input into the hook by invoking the "register" function */}
              <p className="data-field">
                <HiUserCircle className="profile-icon" />
                &nbsp;Name:&nbsp;
                <input
                  defaultValue={`${props.user.firstName} ${props.user.lastName}`}
                  placeholder="Name"
                  className="profile-input"
                  {...register("firstNameLastName", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiPhone className="profile-icon" />
                &nbsp;Phone:&nbsp;
                <input
                  defaultValue={`${
                    props.user.phoneNumber ? props.user.phoneNumber : ""
                  }`}
                  placeholder="Phone Number"
                  className="profile-input"
                  {...register("phoneNumber", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiMap className="profile-icon" />
                &nbsp;Address:&nbsp;
                <textarea
                  defaultValue={`${
                    props.user.address ? props.user.address : ""
                  }`}
                  placeholder="Address"
                  className="profile-input max-h-40 min-h-[2rem]"
                  {...register("address", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiAtSymbol className="profile-icon" />
                &nbsp;Email:&nbsp;
                <input
                  defaultValue={`${props.user.email ? props.user.email : ""}`}
                  placeholder="Email"
                  className="profile-input"
                  {...register("email", { required: true })}
                />
              </p>
              <p className="data-field">
                <IoPaw className="profile-icon" />
                &nbsp;Pet Types:&nbsp;
                <TagInput
                  defaultValue={props.user.petTypes}
                  onChange={(val) => setValue("petTypes", val)}
                />
                {/* <input
                  defaultValue={`${
                    props.user.petTypes ? props.user.petTypes : ""
                  }`}
                  placeholder="Seprate with ,"
                  className="profile-input"
                  {...register("petTypes")}
                /> */}
              </p>

              <div className="mt-3 flex">
                <button
                  onClick={() => setEditing(false)}
                  className="profile-edit-button bg-red-600 hover:bg-red-500"
                >
                  Cancel
                </button>
                <input
                  className="profile-edit-button"
                  type="submit"
                  value="Save profile"
                />
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="mx-3 mt-2 flex max-w-md justify-center sm:w-1/2">
        <h1 className="text-xl font-bold">Posts</h1>
        {/* TODO: Posts display */}
        {/* {users.map((user: any) => (
          <PetSitterCard pet_sitter={user}></PetSitterCard>
        ))} */}
      </div>
    </div>
  );
};

type TagInputProps = {
  defaultValue?: string[];
  onChange?: (newValue: string[]) => void;
};

const TagInput = (props: TagInputProps) => {
  const [animationParent] = useAutoAnimate();
  // A list of pet types that user has selected
  const [editingPetTypes, setEditingPetTypes] = useState<string[]>(
    props.defaultValue ?? []
  );
  // A list of pet types that user hasn't selected
  const unusedPetTypes = petTypesList.filter(
    (petType) => !editingPetTypes.includes(petType)
  );

  // Notify parent component of the change
  const { onChange } = props;
  useEffect(() => {
    onChange?.(editingPetTypes);
  }, [onChange, editingPetTypes]);

  return (
    <div className="flex flex-wrap gap-2" ref={animationParent}>
      {editingPetTypes.map((petType) => (
        <span
          key={petType}
          className="inline-flex items-center rounded-xl bg-slate-200 pl-2 pr-2"
        >
          {petType}
          {/* small close/delete button */}
          <button
            type="button"
            className="duration-250 ml-1 rounded-xl ring-slate-500 transition-all ease-in-out hover:bg-slate-300 hover:ring-1"
            onClick={() =>
              setEditingPetTypes(
                editingPetTypes.filter((type) => type !== petType)
              )
            }
          >
            <HiX className="fill-slate-500" />
          </button>
        </span>
      ))}
      {unusedPetTypes.length > 0 && (
        <Popover className="container relative">
          <Popover.Button className="duration-250 rounded-3xl bg-slate-200 pl-2 pr-2 ring-slate-500 transition-all ease-in-out hover:bg-slate-300 ">
            +
          </Popover.Button>

          <Popover.Panel className="absolute z-10 rounded-md border-2 bg-orange-50 p-4 shadow-lg">
            {/* hadow-lg ring-2
      List of buttons to select a pet type.
      Only shows pet types that are not already selected.
      Each button adds the pet type to the (editing) petTypes array, in sorted ordering.
      */}
            <div className="flex flex-wrap gap-2">
              {unusedPetTypes.map((petType) => (
                <button
                  key={petType}
                  type="button"
                  className="inline rounded-xl bg-slate-200 pl-2 pr-2 transition-all hover:bg-blue-100 hover:pl-3 hover:pr-3"
                  onClick={() => {
                    setEditingPetTypes(editingPetTypes.concat(petType).sort());
                  }}
                >
                  {petType}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </Popover>
      )}
    </div>
  );
};

export default FreelancePetSitterProfile;
