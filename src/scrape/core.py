"""
Web scraping utilities using Crawl4AI.
"""

import asyncio
from typing import Dict, Union
from crawl4ai import AsyncWebCrawler


def scrape_webpage(url: str, timeout: int = 30) -> Dict[str, Union[str, bool]]:
    """
    Extract webpage content using Crawl4AI.
    
    Args:
        url (str): The URL to scrape
        timeout (int): Request timeout in seconds
        
    Returns:
        Dict[str, Union[str, bool]]: Dictionary containing:
            - 'success': bool - Whether the scraping was successful
            - 'content': str - The extracted text content
            - 'title': str - The page title
            - 'url': str - The final URL after any redirects
            - 'error': str - Error message if scraping failed
    """
    
    result = {'success': False, 'content': '', 'title': '', 'url': url, 'error': ''}
    
    async def _async_scrape():
        try:
            async with AsyncWebCrawler(
                headless=True,
                verbose=False
            ) as crawler:
                # Crawl the webpage
                crawl_result = await crawler.arun(
                    url=url,
                    timeout=timeout
                )
                
                if crawl_result.success:
                    # Extract content from the result
                    result['success'] = True
                    result['url'] = crawl_result.url or url
                    result['title'] = crawl_result.metadata.get('title', '') if crawl_result.metadata else ''
                    
                    # Use markdown content as it's cleaner than raw HTML
                    if crawl_result.markdown:
                        # Clean up markdown content
                        lines = [line.strip() for line in crawl_result.markdown.splitlines()]
                        result['content'] = ' '.join(line for line in lines if line)
                    elif crawl_result.cleaned_html:
                        # Fallback to cleaned HTML text
                        result['content'] = crawl_result.cleaned_html
                    else:
                        result['error'] = "No content extracted"
                        result['success'] = False
                else:
                    result['error'] = crawl_result.error_message or "Crawl failed"
                    
        except Exception as e:
            result['error'] = str(e)
    
    asyncio.run(_async_scrape())
    return result


if __name__ == "__main__":
    # Test the scraper
    result = scrape_webpage("https://www.amazon.com/s?k=iphone+17")
    print(f"Success: {result['success']}")
    print(f"Title: {result['title']}")
    print(f"URL: {result['url']}")
    print(f"Content length: {len(result['content'])}")
    if result['error']:
        print(f"Error: {result['error']}")
    else:
        print(f"Content preview: {result['content'][:200]}...")
