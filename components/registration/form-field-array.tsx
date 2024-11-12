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
import { X, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { useState } from "react"

interface FormFieldArrayProps {
  form: UseFormReturn<any>
  name: string
  label: string
  suggestions: string[]
  placeholder: string
}

export function FormFieldArray({
  form,
  name,
  label,
  suggestions,
  placeholder,
}: FormFieldArrayProps) {
  const [openStates, setOpenStates] = useState<boolean[]>([false])

  const addField = () => {
    const currentValues = form.getValues(name)
    form.setValue(name, [...currentValues, ""])
    setOpenStates([...openStates, false])
  }

  const removeField = (index: number) => {
    const currentValues = form.getValues(name)
    if (currentValues.length > 1) {
      form.setValue(
        name,
        currentValues.filter((_, i) => i !== index)
      )
      setOpenStates(openStates.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      {form.watch(name)?.map((_, index: number) => (
        <FormField
          key={`${name}-${index}`}
          control={form.control}
          name={`${name}.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{index === 0 ? label : ""}</FormLabel>
              <div className="flex gap-2">
                <Popover
                  open={openStates[index]}
                  onOpenChange={(open) => {
                    const newOpen = [...openStates]
                    newOpen[index] = open
                    setOpenStates(newOpen)
                  }}
                >
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
                        {field.value || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                      <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                      <CommandGroup>
                        {suggestions.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={() => {
                              form.setValue(`${name}.${index}`, item)
                              const newOpen = [...openStates]
                              newOpen[index] = false
                              setOpenStates(newOpen)
                            }}
                          >
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addField}
      >
        Add {label}
      </Button>
    </div>
  )
}