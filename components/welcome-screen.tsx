'use client'

import { useState } from 'react'
import { Calendar, GraduationCap, School, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { GitHubUser, UserFormData } from '../types/github'
import { colleges } from '../data/colleges'


interface WelcomeScreenProps {
  githubUser: GitHubUser
  action: (formData: FormData) => void
}

export function WelcomeScreen({ githubUser, action }: WelcomeScreenProps) {
  const [formData, setFormData] = useState<UserFormData>({
    collegeName: '',
    graduationYear: '',
    department: '',
    selected_skill: '',
  })
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)

  const yearsSince = new Date().getFullYear() - new Date(githubUser.created_at).getFullYear()



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const collegeName = formData.collegeName;
    const graduationYear = formData.graduationYear;
    const department = formData.department;
    const selected_skill = formData.selected_skill;
    const newformData = new FormData();
    newformData.append('collegeName', collegeName);
    newformData.append('graduationYear', graduationYear);
    newformData.append('department', department);
    newformData.append('selected_skill', selected_skill);
    setLoading(true);
    try {
      await action(newformData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={githubUser.avatar_url || "/placeholder.svg"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-primary"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome, {githubUser.name || githubUser.login}! 👋</h1>
              <p className="text-muted-foreground">{githubUser.bio}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GitHub veteran of</p>
                <p className="font-medium">{yearsSince} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded">
                <School className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Public repositories</p>
                <p className="font-medium">{githubUser.public_repos}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="font-medium">{githubUser.followers}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {formData.collegeName && colleges
                        ? colleges.find((college) => college.name === formData.collegeName)?.name
                        : "Select college..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white">
                    <Command className="bg-white">
                      <CommandInput placeholder="Search college..." className="bg-white" />
                      <CommandEmpty>No college found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {colleges && colleges.map((college) => (
                          <CommandItem
                            key={college.id}
                            value={college.name}
                            onSelect={(currentValue) => {
                              setFormData({ ...formData, collegeName: currentValue })
                              setOpen(false)
                            }}
                            className="cursor-pointer hover:bg-accent"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.collegeName === college.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{college.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {college.city}, {college.state}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Select
                  value={formData.graduationYear}
                  onValueChange={(value) => setFormData({ ...formData, graduationYear: value })}
                >
                  <SelectTrigger id="graduationYear">
                    <SelectValue placeholder="Select graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                    <SelectItem value="eee">Electrical & Electronics</SelectItem>
                    <SelectItem value="mech">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skilltolearn">Choose a skill to learn</Label>
                <Select
                  value={formData.selected_skill}
                  onValueChange={(value) => setFormData({ ...formData, selected_skill: value })}
                >
                  <SelectTrigger id="selected_skill">
                    <SelectValue placeholder="Select your skill to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="ai">AI Engineer</SelectItem>
                    <SelectItem value="data">Data Engineer</SelectItem>
                    <SelectItem value="flutter">Flutter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : 'Explore'}
        </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
