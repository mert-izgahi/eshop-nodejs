import React from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Option } from '@/lib/lookups'
import { Label } from '../ui/label'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RadioFieldProps {
    value?: string
    onChange?: (value: string) => void
    options: Option[]
    name?: string
    itemClassName?: string
}

function RadioField({ value, onChange, options, name, itemClassName }: RadioFieldProps) {
    return (
        <RadioGroup value={value} onValueChange={onChange} name={name} >
            {options.map((option) => (
                <Label htmlFor={option.value.toString()} key={option.value} className={cn("flex items-center space-x-2 p-4 border border-border rounded h-10 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800", itemClassName)}>
                    <RadioGroupItem
                        hidden
                        value={option.value.toString()}
                        id={option.value.toString()}
                    />
                    <span>{option.label}</span>

                    {value === option.value.toString() && (
                        <div className='w-4 h-4 rounded-sm flex items-center justify-center bg-red-600 ms-auto'>
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    )}
                </Label>
            ))}
        </RadioGroup>
    )
}

export default RadioField