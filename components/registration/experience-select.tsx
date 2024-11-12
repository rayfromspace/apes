"use client"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { useState } from "react"

const experienceLevels = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "10+ years",
]

interface ExperienceSelectProps {
  form: UseFormReturn<any>
}

export function ExperienceSelect({ form }: ExperienceSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={form.control}
      name="experience"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Experience</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || "Select experience level..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search experience..." />
                <CommandEmpty>No experience level found.</CommandEmpty>
                <CommandGroup>
                  {experienceLevels.map((level) => (
                    <CommandItem
                      key={level}
                      value={level}
                      onSelect={() => {
                        form.setValue("experience", level)
                        setOpen(false)
                      }}
                    >
                      {level}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}