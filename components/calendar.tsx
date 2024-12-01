"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Week')
  const router = useRouter();
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 p-6 flex flex-col gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Mini Calendar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">July 2022</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            <div className="text-muted-foreground">Mo</div>
            <div className="text-muted-foreground">Tu</div>
            <div className="text-muted-foreground">We</div>
            <div className="text-muted-foreground">Th</div>
            <div className="text-muted-foreground">Fr</div>
            <div className="text-muted-foreground">Sa</div>
            <div className="text-muted-foreground">Su</div>
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-sm hover:bg-accent ${
                  i === 10 ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Card>

        {/* Current Event Card */}
        <Card className="p-4 bg-muted/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">12:00 - 13:30</p>
              <h3 className="font-semibold mt-1">Meet Gabriel at the International Library</h3>
            </div>
            <span className="text-sm text-muted-foreground">14 min</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Later</Button>
            <Button variant="secondary" size="sm">Details</Button>
          </div>
        </Card>

        {/* Calendars Section */}
        <div>
          <h3 className="font-semibold mb-3">My Calendars</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded-sm" defaultChecked />
              <span>Antonio Larentio</span>
              <span className="ml-auto bg-primary/20 text-primary px-2 rounded-full text-xs">8</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded-sm" defaultChecked />
              <span>Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded-sm" defaultChecked />
              <span>Birthdays</span>
              <span className="ml-auto bg-primary/20 text-primary px-2 rounded-full text-xs">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-semibold">December, 2023</h1>
          <div className="flex items-center gap-4">
            <div className="flex">
              <Button
                variant={view === 'Month' ? 'secondary' : 'ghost'}
                onClick={() => setView('Month')}
                className="rounded-r-none"
              >
                Month
              </Button>
              <Button
                variant={view === 'Week' ? 'secondary' : 'ghost'}
                onClick={() => setView('Week')}
                className="rounded-none border-x"
              >
                Week
              </Button>
              <Button
                variant={view === 'Day' ? 'secondary' : 'ghost'}
                onClick={() => setView('Day')}
                className="rounded-l-none"
              >
                Day
              </Button>
            </div>
            <Button variant="outline">Today</Button>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-7 gap-4">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-sm text-muted-foreground mb-2">{day}</div>
                <div className={`text-2xl font-semibold ${i === 1 ? 'p-2 bg-primary text-primary-foreground rounded-lg' : ''}`}>
                  {16 + i}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 relative">
            {/* Time Labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 text-sm text-muted-foreground">
                  {(6 + i).toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Events Grid */}
            <div className="ml-16 grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="relative h-[640px] border-l">
                  {dayIndex === 1 && (
                    <>
                      <div className="absolute top-0 left-2 right-2 h-20 bg-blue-100 rounded-lg p-2">
                        <p className="text-sm font-medium">Booking taxi app</p>
                        <p className="text-xs text-muted-foreground">06:00 - 07:30</p>
                        <div className="flex -space-x-2 mt-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src="/placeholder.svg" />
                          </Avatar>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src="/placeholder.svg" />
                          </Avatar>
                        </div>
                      </div>
                      <div className="absolute top-24 left-2 right-2 h-16 bg-green-100 rounded-lg p-2">
                        <p className="text-sm font-medium">Design onboarding</p>
                        <p className="text-xs text-muted-foreground">07:30 - 08:30</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Add Event Button */}
        <div className="p-6 border-t flex justify-between">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
