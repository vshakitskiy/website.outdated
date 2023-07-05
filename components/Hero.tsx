"use client"

import { discordProps } from "@/data/types"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import Skeleton from "./Skeleton"
import { motion } from "framer-motion"
import { socials } from "@/data"
import Link from "next/link"

const Hero = () => {
    const [discordData, setDiscordData] = useState<null | discordProps>(null)
    const [date, setDate] = useState<null | string>(null)

    const statusColor = discordData?.online === "online"
        ? "bg-green-700"
        : discordData?.online === "idle"
            ? "bg-orange-400"
            : discordData?.online === "dnd"
                ? "bg-red-600"
                : "bg-gray-800"

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get("/api/discord")
            setDiscordData(data)
        }
        fetch()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }))
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <motion.section
            className="flex flex-col-reverse hero:flex-row hero:justify-around pt-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: .3 }}
        >
            <div className="flex flex-col gap-8 sm:justify-between">
                <div>
                    {discordData?.username ? (
                        <h1 className="text-6xl sm:text-7xl mt-4">
                            {discordData.username}
                        </h1>
                    ) : (
                        <span className="inline-block">
                            <Skeleton
                                className="sm:w-[400px] sm:h-[60px] w-[340px] h-[45px] mt-6"
                            />
                        </span>
                    )}
                    {discordData?.global ? (
                        <h2 className="text-gray-400 sm:text-3xl text-2xl">
                            {discordData.global}
                        </h2>
                    ) : (
                        <span>
                            <Skeleton
                                className="sm:h-[36px] h-[30px]"
                                width={100}
                            />
                        </span>
                    )}
                    {(discordData?.online && date) ? (
                        <span className="flex items-center gap-2 text-gray-500 mt-3 sm:mt-1">
                            <div className={`rounded-full w-4 h-4 ${statusColor}`} />
                            <p>{discordData?.online}</p>
                            •
                            <p>{date}</p>
                        </span>
                    ) : (
                        <span className="flex gap-2 items-center mt-4 sm:mt-1">
                            <Skeleton
                                className="rounded-full"
                                height={18}
                                width={18}
                            />
                            <Skeleton
                                height={25}
                                width={300}
                            />
                        </span>
                    )}
                </div>
                <div className="flex gap-3 mb-2">
                    {socials.map((social, index) => (
                        <a
                            onClick={() => window.location.assign(social.destination)}
                            key={`socials-${index}`}
                            className={`${social.styles && "invert"} cursor-pointer`}
                        >
                            <Image
                                src={social.url}
                                alt={social.title}
                                width={30}
                                height={30}
                                className={`hover:scale-[1.1] ease-in-out duration-500`}
                            />
                        </a>
                    ))}
                </div>
            </div>
            {discordData ? (
                <Image
                    className="rounded-xl"
                    src={discordData?.imageUrl}
                    width={250}
                    height={250}
                    alt="Logo"
                />
            ) : (
                <Skeleton
                    height={250}
                    width={250}
                    className="rounded-xl"
                />
            )}
        </motion.section>
    )
}

export default Hero