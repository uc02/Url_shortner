'use client'

import { LoadingState } from "@/components/LoadingSpinner"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface RedirectResponse{
  originalUrl: string,
  shortId: string,
  error?: string
}

export default function RedirectingPage(){
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');
  const [error, setError] = useState('')

  const shortId = params.shortId as string

  useEffect(() => {
    const handleRedirecting = async () => {
      if(!shortId){
        setStatus('error')
        setError('Invalid short URL')
        return;
      }

      try {
        setStatus('loading')

        const response = await fetch(`/api/${shortId}`)

        console.log(response)
        
        const data: RedirectResponse = await response.json();

        if(!response.ok || data.error){
          throw new Error(data.error || 'Failed to redirect')
        }

        if(data.originalUrl){
          setStatus('redirecting')
          router.push(data.originalUrl)
        }else{
          throw new Error('No url found')
        }

      } catch (error) {
        setStatus('error')
        setError(error instanceof Error ? error.message : 'An unexpected Error occur')
      }
    }

    handleRedirecting()
  },[shortId])

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'redirecting') {
    return <RedirectingState />;
  }

  return null;
}

function RedirectingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-pulse bg-green-500 rounded-full h-12 w-12 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Redirecting...</h2>
        <p className="text-gray-600 mt-2"></p>
      </div>
    </div>
  );
}

