"""
Screenshot utilities using Playwright.
"""

import asyncio
import base64
from typing import Dict, Union, Optional
from playwright.async_api import async_playwright


def take_screenshot(
    url: str,
    timeout: int = 30000,
    full_page: bool = True,
    viewport_width: int = 1280,
    viewport_height: int = 1024
) -> Dict[str, Union[str, bool]]:
    """
    Take a screenshot of a webpage using Playwright.
    
    Args:
        url (str): The URL to screenshot
        timeout (int): Request timeout in milliseconds (default: 30000)
        full_page (bool): Whether to take a full page screenshot (default: True)
        viewport_width (int): Viewport width in pixels (default: 1280)
        viewport_height (int): Viewport height in pixels (default: 1024)
        
    Returns:
        Dict[str, Union[str, bool]]: Dictionary containing:
            - 'success': bool - Whether the screenshot was successful
            - 'screenshot': str - Base64 encoded screenshot image
            - 'error': str - Error message if screenshot failed
    """
    
    result = {'success': False, 'screenshot': '', 'error': ''}
    
    async def _async_screenshot():
        browser = None
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    viewport={'width': viewport_width, 'height': viewport_height}
                )
                page = await context.new_page()
                
                # Navigate to the page
                await page.goto(url, timeout=timeout, wait_until='domcontentloaded')
                
                # Wait a bit for content to render
                await page.wait_for_timeout(2000)
                
                # Take screenshot
                screenshot_bytes = await page.screenshot(full_page=full_page)
                
                # Encode to base64
                result['screenshot'] = base64.b64encode(screenshot_bytes).decode('utf-8')
                result['success'] = True
                
                await browser.close()
                    
        except Exception as e:
            result['error'] = str(e)
            if browser:
                try:
                    await browser.close()
                except:
                    pass
    
    asyncio.run(_async_screenshot())
    return result


if __name__ == "__main__":
    # Test the screenshot function
    print("Testing Playwright screenshot...")
    result = take_screenshot("https://www.example.com")
    print(f"Success: {result['success']}")
    if result['error']:
        print(f"Error: {result['error']}")
    else:
        print(f"Screenshot length: {len(result['screenshot'])} bytes (base64)")

