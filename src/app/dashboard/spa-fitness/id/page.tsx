"use client"
import MainLayout from '@/components/layout/MainLayout'
import PageHeader from '@/components/reusable/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const page = () => {
    const [selectedServices, setSelectedServices] = useState(['Full Body Massage'])
    const [clientName, setClientName] = useState('Oyefeso Afolabi')
    const [additionalRequest, setAdditionalRequest] = useState('')

    const availableServices = [
        'Full Body Massage',
        'Swedish Massage',
        'Deep Tissue Massage',
        'Hot Stone Massage',
        'Aromatherapy Massage'
    ]

    const handleServiceToggle = (service: any) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(s => s !== service))
        } else {
            setSelectedServices([...selectedServices, service])
        }
    }


    return (
        <MainLayout navigation={<PageHeader page='SPA' subpage='Sunday-29-10-AM' />} buttonText={""} buttonVisible={true}>
            <div className="container mx-auto py-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="col-span-2">
                        <CardContent className="p-6 space-y-6">
                            {/* Required Service Section */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Required Service</h2>
                                <div className="flex flex-wrap gap-2">
                                    {availableServices.map((service) => (
                                        <Button
                                            key={service}
                                            variant={selectedServices.includes(service) ? "secondary" : "outline"}
                                            className={`rounded-md ${selectedServices.includes(service)
                                                ? 'bg-gray-200 hover:bg-gray-300'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            onClick={() => handleServiceToggle(service)}
                                        >
                                            {service}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Request Section */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Additional Request</h2>
                                <div className="w-full h-24 "/>
                            </div>

                            {/* Client's Name Section */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="clientName" className="text-lg font-medium">
                                        Client's Name: {clientName}
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}

export default page