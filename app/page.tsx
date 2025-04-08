"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function RandomStudentPicker() {
  const [totalStudents, setTotalStudents] = useState(67)
  const [absentStudents, setAbsentStudents] = useState<number[]>([])
  const [absentInput, setAbsentInput] = useState("")
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([])
  const [currentNumber, setCurrentNumber] = useState<number | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [error, setError] = useState("")
  const [currentRotation, setCurrentRotation] = useState(0)
  const [animationId, setAnimationId] = useState<number | null>(null)

  // Function to add absent student
  const addAbsentStudent = () => {
    const num = Number.parseInt(absentInput)
    setError(``)
    if (isNaN(num) || num < 1 || num > totalStudents) {
      setError(`Please enter a valid number between 1 and ${totalStudents}`)
      return ('')
    }

    if (absentStudents.includes(num)) {
      setError("This student is already marked absent")
      return
    }

    // if (absentStudents.length >= 6) {
    //   setError("You can only mark up to 6 students absent")
    //   return
    // }

    setAbsentStudents([...absentStudents, num])
    setAbsentInput("")
    setError("")
  }

  // Function to remove absent student
  const removeAbsentStudent = (student: number) => {
    setAbsentStudents(absentStudents.filter((s) => s !== student))
  }

  // Function to generate a random number with exciting animation
  const generateRandomNumber = () => {
    // Get all available numbers (not absent and not previously generated)
    const availableNumbers = Array.from({ length: totalStudents }, (_, i) => i + 1).filter(
      (num) => !absentStudents.includes(num) && !generatedNumbers.includes(num),
    )

    if (availableNumbers.length === 0) {
      setError("All students have been selected. Reset to start again.")
      return
    }

    setError("")
    setIsSpinning(true)

    // Choose the final number in advance
    const selectedNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
    const targetRotation = (selectedNumber / totalStudents) * 360

    // Animation variables
    const speed = 30
    const slowdownFactor = 0.98
    let currentSpeed = speed
    let totalRotation = 0
    const additionalRotations = 2 + Math.random() * 3 // 2-5 additional rotations for excitement
    const targetTotalRotation = 360 * additionalRotations + targetRotation

    // Clear any existing animation
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }

    // Animation function
    const animate = () => {
      if (currentSpeed < 0.1) {
        // Animation complete
        setCurrentRotation(targetRotation)
        setCurrentNumber(selectedNumber)
        setGeneratedNumbers((prev) => [...prev, selectedNumber])
        setIsSpinning(false)
        return
      }

      totalRotation += currentSpeed

      // Gradually slow down as we approach the target
      if (totalRotation > targetTotalRotation * 0.7) {
        currentSpeed *= slowdownFactor
      }

      // Set the visual rotation (modulo 360 to keep it within a circle)
      setCurrentRotation(totalRotation % 360)

      // Continue animation
      const id = requestAnimationFrame(animate)
      setAnimationId(id)
    }

    // Start animation
    const id = requestAnimationFrame(animate)
    setAnimationId(id)
  }

  // Function to reset everything
  const resetAll = () => {
    setGeneratedNumbers([])
    setCurrentNumber(null)
    setError("")
  }
  // Create clock numbers
  const clockNumbers = Array.from({ length: 12 }, (_, i) => i + 1)

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [animationId])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4x">
      <h1 className="text-3xl font-bold text-center mb-8 rand_grad">Random Student Picker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Mark Absent Students</h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="absent-input" className="sr-only">
                  Absent Student Number
                </Label>
                <Input
                  className="!text-black"
                  id="absent-input"
                  type="number"
                  min={1}
                  max={totalStudents}
                  value={absentInput}
                  onChange={(e) => setAbsentInput(e.target.value)}
                  placeholder="Enter student number"
                  onKeyDown={(e) => e.key === "Enter" && addAbsentStudent()}
                />
              </div>
              <Button onClick={addAbsentStudent} className="bg-blue-500 hover:bg-blue-400 transition-colors duration-200">Add</Button>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Absent Students:</h3>
            <div className="flex flex-wrap gap-2">
              {absentStudents.length === 0 ? (
                <p className="text-muted-foreground">No students marked absent</p>
              ) : (
                absentStudents.map((student) => (
                  <Badge key={student} variant="secondary" className="flex items-center gap-1 border-2 border-blue-500">
                    {student}
                    <button onClick={() => removeAbsentStudent(student)} className="ml-1">
                      <X className="h-3 w-3 text-blue-500" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Previously Selected:</h3>
            <div className="flex flex-wrap gap-2">
              {generatedNumbers.length === 0 ? (
                <p className="text-muted-foreground">No students selected yet</p>
              ) : (
                generatedNumbers.map((num) => (
                  <Badge key={num} variant="outline" className="text-white border-2 border-blue-500">
                    {num}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateRandomNumber} disabled={isSpinning}
              className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors duration-200">
              {isSpinning ? "Selecting..." : "Pick Random Student"}
            </Button>
            <Button variant="outline" onClick={resetAll}
              className="flex-1
            text-blue-500 hover:bg-blue-500 transition-colors duration-200 
            hover:text-white 
            border-2 border-blue-500"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-blue-500 flex items-center justify-center">
            {/* Clock numbers */}
            {clockNumbers.map((num, index) => {
              const angle = index * 30 * (Math.PI / 180)
              const x = Math.sin(angle) * 100
              const y = -Math.cos(angle) * 100
              return (
                <div
                  key={num}
                  className="absolute text-sm font-medium w-8 h-8 flex items-center justify-center"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {num * 5 <= totalStudents ? num * 5 : ""}
                </div>
              )
            })}

            {/* Clock hand */}
            <div
              className="absolute bg-blue-500 rounded-full"
              style={{
                width: "1.5px",
                height: "90px",
                top: "50%",
                left: "50%",
                marginLeft: "-0.75px" /* Half of width */,
                transformOrigin: "center bottom",
                transform: `translateY(-100%) rotate(${currentRotation}deg)`,
                boxShadow: isSpinning ? "0 0 5px rgba(0, 0, 0, 0.3)" : "none",
                transition: isSpinning ? "none" : "transform 0.5s ease-out",
              }}
            />

            {/* Clock hand cap */}
            <div className="absolute w-5 h-5 bg-blue-500 rounded-full z-10" />

            {/* Center dot */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full" />

            {/* Current number display */}
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <div className="text-4xl font-bold">{currentNumber || "-"}</div>
              <div className="text-sm text-muted-foreground">Current Selection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

