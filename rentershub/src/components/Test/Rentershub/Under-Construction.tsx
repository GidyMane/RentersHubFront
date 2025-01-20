"use client"

import React from "react"
import { motion } from "framer-motion"
import { HardHat, Hammer, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UnderConstruction() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            🚧 Under Construction 🚧
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-lg">Our developers are hard at work!</p>
          <div className="flex justify-center space-x-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <HardHat className="h-8 w-8 text-yellow-500" />
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, -45, 0],
                transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <Hammer className="h-8 w-8 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 360],
                transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <Wrench className="h-8 w-8 text-red-500" />
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground">
            We're adding awesome new features to make your experience even better. Check back soon!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

